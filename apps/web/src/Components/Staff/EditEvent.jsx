import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../Authentication/AuthContext";
import { patchEvent } from "../../AxiosApi/axiosApi";
import placeholderImage from "../../assets/No-Image-Placeholder.svg";
import {
  Box,
  TextField,
  Checkbox,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

function EditEvent({ event, setEditing, eventId }) {
  const { user, loading, logout, showToast } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: event.title || "",
    location: event.location || "",
    description: event.text || "",
    startDate: new Date(event.startDate) || new Date(),
    startTime: new Date(`${event.startDate} ${event.startTime}`) || new Date(),
    endDate: new Date(event.endDate) || new Date(),
    endTime:
      new Date(`${event.endDate} ${event.endTime}`) ||
      new Date(new Date().getTime() + 5 * 60000),
    sameAsStartDate: event.startDate === event.endDate, // Assuming this condition for same as start date
    fbEvent: event.fb_link || "",
    instaLink: event.instagram || "",
    image: event.pictures?.[0] || null, // Assuming you're using the first image if available
  });

  const [imagePreview, setImagePreview] = useState(
    event.pictures?.[0] || placeholderImage
  );

  function authFailed() {
    logout();
    showToast("Your session has expired. Please log in again.");
  }

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  const handleChange = (field, value) => {
    if (field === "image") {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

      if (!allowedTypes.includes(value.type)) {
        alert("Only JPG, JPEG, or PNG files are allowed.");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(value);
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartDateChange = (date) => {
    handleChange("startDate", date);
    if (formData.sameAsStartDate || date > formData.endDate) {
      handleChange("endDate", date);
    }
    if (formData.sameAsStartDate && formData.endTime < formData.startTime) {
      handleChange(
        "endTime",
        new Date(formData.startTime.getTime() + 5 * 60000)
      );
    }
  };

  const handleStartTimeChange = (time) => {
    if (time.getHours() === 0 && time.getMinutes() === 0) return;
    handleChange("startTime", time);
    if (formData.sameAsStartDate && formData.endTime < time) {
      handleChange("endTime", new Date(time.getTime() + 5 * 60000));
    }
    if (
      formData.startDate.getTime() === formData.endDate.getTime() &&
      formData.endTime < time
    ) {
      handleChange("endTime", new Date(time.getTime() + 5 * 60000));
    }
  };

  const handleSameAsStartDateChange = (e) => {
    const isChecked = e.target.checked;
    handleChange("sameAsStartDate", isChecked);
    if (isChecked) {
      handleChange("endDate", formData.startDate);
      if (formData.endTime < formData.startTime) {
        handleChange(
          "endTime",
          new Date(formData.startTime.getTime() + 5 * 60000)
        );
      }
    }
  };

  const isSameDate = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const handleEndDateChange = (date) => {
    handleChange("endDate", date);
    if (
      isSameDate(formData.startDate, date) &&
      formData.endTime < formData.startTime
    ) {
      handleChange(
        "endTime",
        new Date(formData.startTime.getTime() + 5 * 60000)
      );
    }
  };
  const handleCancel = (e) => {
    e.preventDefault();
    setEditing(false);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title) newErrors.title = "Title is required.";
    if (formData.title.length > 100)
      newErrors.title = "Title must be less than 100 characters.";
    if (!formData.location) newErrors.location = "Location is required.";
    if (formData.location.length > 150)
      newErrors.location = "Location must be less than 150 characters.";
    if (!formData.description)
      newErrors.description = "Description is required.";
    if (formData.description.length < 50)
      newErrors.description = "Description must be at least 50 characters.";
    if (!formData.startDate) newErrors.startDate = "Start date is required.";
    if (!formData.startTime) newErrors.startTime = "Start time is required.";
    if (!formData.endDate) newErrors.endDate = "End date is required.";
    if (!formData.endTime) newErrors.endTime = "End time is required.";

    const urlRegex =
      /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:[0-9]{1,5})?(\/.*)?$/;
    if (formData.fbEvent && !urlRegex.test(formData.fbEvent)) {
      newErrors.fbEvent = "Invalid URL.";
    }
    if (formData.instaLink && !urlRegex.test(formData.instaLink)) {
      newErrors.instaLink = "Invalid URL.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setGeneralError(null);
    if (validateForm()) {
      setUploading(true);
      patchEvent(eventId, formData)
        .then((data) => {
          setUploading(false);
          if (data.message === "Invalid or expired token.") {
            authFailed();
          }
          setEditing(false);
        })
        .catch((err) => {
          if (err.message === "Invalid or expired token.") {
            authFailed();
          } else {
            setGeneralError("An error occurred, please try again later.");
          }
          setUploading(false);
        });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: "0 auto",
        padding: 3,
        backgroundColor: "white",
        boxShadow: 3,
        borderRadius: 2,
        marginTop: { xs: 0, sm: "1rem", md: "5rem" },
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 2, textAlign: "center" }}>
        Edit Event
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body1">Title *</Typography>
          <TextField
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            fullWidth
            error={!!errors.title}
            helperText={errors.title}
          />
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body1">Location *</Typography>
          <TextareaAutosize
            minRows={3}
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            style={{ width: "100%", resize: "none" }}
          />
          {errors.location && (
            <Typography variant="body2" color="error">
              {errors.location}
            </Typography>
          )}
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body1">Description *</Typography>
          <TextareaAutosize
            minRows={4}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            style={{ width: "100%", resize: "none" }}
          />
          {errors.description && (
            <Typography variant="body2" color="error">
              {errors.description}
            </Typography>
          )}
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body1">Start Date *</Typography>
          <DatePicker
            selected={formData.startDate}
            onChange={handleStartDateChange}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
            customInput={
              <TextField
                fullWidth
                error={!!errors.startDate}
                helperText={errors.startDate}
              />
            }
          />
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body1">Start Time *</Typography>
          <DatePicker
            selected={formData.startTime}
            onChange={handleStartTimeChange}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={5}
            timeCaption="Time"
            dateFormat="HH:mm"
            minTime={new Date(0, 0, 0, 0, 5)}
            maxTime={new Date(0, 0, 0, 23, 59)}
            customInput={
              <TextField
                fullWidth
                error={!!errors.startTime}
                helperText={errors.startTime}
              />
            }
          />
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body1">End Date *</Typography>
          <DatePicker
            disabled={formData.sameAsStartDate}
            selected={formData.endDate}
            onChange={handleEndDateChange}
            minDate={formData.startDate}
            dateFormat="dd/MM/yyyy"
            customInput={
              <TextField
                fullWidth
                error={!!errors.endDate}
                helperText={errors.endDate}
              />
            }
          />
          <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
            <Checkbox
              checked={formData.sameAsStartDate}
              onChange={handleSameAsStartDateChange}
              color="primary"
            />
            <Typography variant="body2">Same as Start Date</Typography>
          </Box>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body1">End Time *</Typography>
          <DatePicker
            selected={formData.endTime}
            onChange={(time) => handleChange("endTime", time)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={5}
            timeCaption="Time"
            dateFormat="HH:mm"
            minTime={
              formData.endDate > formData.startDate
                ? new Date(0, 0, 0, 0, 5)
                : new Date(formData.startTime.getTime() + 5 * 60000)
            }
            maxTime={new Date(0, 0, 0, 23, 59)}
            customInput={
              <TextField
                fullWidth
                error={!!errors.endTime}
                helperText={errors.endTime}
              />
            }
          />
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body1">Facebook Event Link</Typography>
          <TextField
            type="text"
            value={formData.fbEvent}
            onChange={(e) => handleChange("fbEvent", e.target.value)}
            fullWidth
            error={!!errors.fbEvent}
            helperText={errors.fbEvent}
          />
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body1">Instagram Link</Typography>
          <TextField
            type="text"
            value={formData.instaLink}
            onChange={(e) => handleChange("instaLink", e.target.value)}
            fullWidth
            error={!!errors.instaLink}
            helperText={errors.instaLink}
          />
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body1">Event Image</Typography>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => handleChange("image", e.target.files[0])}
          />
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body2">Image Preview</Typography>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: "200px", height: "auto" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholderImage;
              }}
            />
          )}
        </Box>

        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={uploading}
          >
            {uploading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Edit Event"
            )}
          </Button>
          <Button
            onClick={handleCancel}
            variant="contained"
            color="primary"
            disabled={uploading}
          >
            Cancel
          </Button>
        </Box>
        {generalError && (
          <Typography
            variant="body2"
            textAlign="center"
            color="error"
            sx={{ marginTop: 2 }}
          >
            {generalError}
          </Typography>
        )}
      </form>
    </Box>
  );
}

export default EditEvent;
