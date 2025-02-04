import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../Authentication/AuthContext";
import { postEvent } from "../../AxiosApi/axiosApi";

function CreateEvent() {
  const { user, loading, logout, showToast } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    startDate: new Date(),
    startTime: new Date(),
    endDate: new Date(),
    endTime: new Date(new Date().getTime() + 5 * 60000),
    sameAsStartDate: false,
    fbEvent: "",
    instaLink: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

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

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title) newErrors.title = "Title is required.";
    if (!formData.location) newErrors.location = "Location is required.";
    if (!formData.description)
      newErrors.description = "Description is required.";
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
      postEvent(formData)
        .then((data) => {
          setUploading(false);
          if (data.message === "Invalid or expired token.") {
            authFailed();
          }
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
    <div>
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          {errors.title && <p style={{ color: "red" }}>{errors.title}</p>}
        </div>

        <div>
          <label>Location *</label>
          <TextareaAutosize
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
          {errors.location && <p style={{ color: "red" }}>{errors.location}</p>}
        </div>

        <div>
          <label>Description *</label>
          <TextareaAutosize
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          {errors.description && (
            <p style={{ color: "red" }}>{errors.description}</p>
          )}
        </div>

        <div>
          <label>Start Date *</label>
          <DatePicker
            selected={formData.startDate}
            onChange={handleStartDateChange}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
          />
          {errors.startDate && (
            <p style={{ color: "red" }}>{errors.startDate}</p>
          )}
        </div>

        <div>
          <label>Start Time *</label>
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
          />
          {errors.startTime && (
            <p style={{ color: "red" }}>{errors.startTime}</p>
          )}
        </div>

        <div>
          <label>End Date *</label>
          <DatePicker
            disabled={formData.sameAsStartDate}
            selected={formData.endDate}
            onChange={handleEndDateChange}
            minDate={formData.startDate}
            dateFormat="dd/MM/yyyy"
          />
          <label>
            <input
              type="checkbox"
              checked={formData.sameAsStartDate}
              onChange={handleSameAsStartDateChange}
            />
            Same as Start Date
          </label>
          {errors.endDate && <p style={{ color: "red" }}>{errors.endDate}</p>}
        </div>

        <div>
          <label>End Time *</label>
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
          />
          {errors.endTime && <p style={{ color: "red" }}>{errors.endTime}</p>}
        </div>

        <div>
          <label>Facebook Event Link</label>
          <input
            type="text"
            value={formData.fbEvent}
            onChange={(e) => handleChange("fbEvent", e.target.value)}
          />
          {errors.fbEvent && <p style={{ color: "red" }}>{errors.fbEvent}</p>}
        </div>

        <div>
          <label>Instagram Link</label>
          <input
            type="text"
            value={formData.instaLink}
            onChange={(e) => handleChange("instaLink", e.target.value)}
          />
          {errors.instaLink && (
            <p style={{ color: "red" }}>{errors.instaLink}</p>
          )}
        </div>

        <div>
          <label>Event Image</label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => handleChange("image", e.target.files[0])}
          />
        </div>
        {imagePreview && (
          <div>
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: "200px", height: "auto" }}
            />
          </div>
        )}

        <div>
          <button type="submit">
            {uploading ? "Loading..." : "Create event"}
          </button>
          {generalError && <p style={{ color: "red" }}>{generalError}</p>}
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;
