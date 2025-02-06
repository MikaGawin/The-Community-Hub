import React, { useState } from "react";
import { getUserByEmail, patchStaffStatus } from "../../AxiosApi/axiosApi";
import { useAuth } from "../Authentication/AuthContext";
import { Box, TextField, Button, CircularProgress, Typography } from "@mui/material";

function AddStaff() {
  const [email, setEmail] = useState("");
  const { user, loading, logout, showToast } = useAuth();
  const [userName, setUserName] = useState(null);
  const [confirmation, setConfirmation] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [error, setError] = useState(null);
  const [userFetchError, setUserFetchError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [userid, setUserid] = useState(null);

  function authFailed() {
    logout();
    showToast("Your session has expired. Please log in again.");
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(null);
  };

  const handleFetchUser = (e) => {
    e.preventDefault();
    if (!email) {
      setEmailError("Please enter an email.");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setLoadingUser(true);
    setUserFetchError(null);
    setError(null);

    getUserByEmail(email)
      .then((data) => {
        setLoadingUser(false);
        if (data.message === "Invalid or expired token.") {
          authFailed();
        } else if (data.staff === true) {
          setUserFetchError("This user is already staff.");
        } else if (data.name) {
          setUserName(data.name);
          setUserid(data.userid);
        } else {
          setUserName(null);
          setUserFetchError("No user found with this email.");
        }
      })
      .catch((err) => {
        if (err.message === "Invalid or expired token.") {
          authFailed();
        } else {
          setUserFetchError("An error occurred, please try again later.");
        }
        setLoadingUser(false);
      });
  };

  const handleMakeStaff = async () => {
    setError(null);
    setUserFetchError(null);
    if (confirmation) {
      setLoadingConfirm(true);
      patchStaffStatus(userid)
        .then((data) => {
          setLoadingConfirm(false);
          if (data.message === "Invalid or expired token.") {
            authFailed();
          } else {
            showToast(`${userName} is now a staff member.`);
            setEmail("");
            setUserName(null);
            setConfirmation(false);
          }
        })
        .catch((err) => {
          if (err.message === "Invalid or expired token.") {
            authFailed();
          } else {
            setUserFetchError("An error occurred, please try again later.");
          }
          setLoadingConfirm(false);
        });
    } else {
      setError("Please confirm the action before submitting.");
    }
  };

  const handleCancel = () => {
    setUserName(null);
    setConfirmation(false);
    setEmailError(null);
    setError(null);
  };

  if (loading) return <p>Loading...</p>;

  return (
<Box
  sx={{
    maxWidth: 600,
    margin: "0 auto",
    padding: 3,
    backgroundColor: "white",
    boxShadow: 3,
    borderRadius: 2,
    marginTop: { xs: 0, sm: "1rem", md: "5rem" },
  }}
>
  <Typography variant="h4" sx={{ marginBottom: 2, textAlign: "center" }}>
    Add Staff
  </Typography>
  <form>
    <Box sx={{ marginBottom: 2 }}>
      <Typography variant="body1">Enter Email:</Typography>
      <TextField
        type="email"
        id="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Enter user email"
        fullWidth
        error={!!emailError}
        helperText={emailError}
      />
    </Box>
    <Box sx={{ marginBottom: 2, textAlign: "center" }}>
      <Button
        type="button"
        onClick={handleFetchUser}
        disabled={loadingUser}
        variant="contained"
        color="primary"
      >
        {loadingUser ? <CircularProgress size={24} color="inherit" /> : "Find User"}
      </Button>
    </Box>
    {userFetchError && (
      <Typography variant="body2" color="error" sx={{ textAlign: "center" }}>
        {userFetchError}
      </Typography>
    )}

    {userName && (
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Name associated with email: {userName}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            id="confirm"
            checked={confirmation}
            onChange={(e) => setConfirmation(e.target.checked)}
            color="primary"
          />
          <Typography variant="body2">I am sure</Typography>
        </Box>
        <Box sx={{ textAlign: "center", marginTop: 2 }}>
          <Button
            type="button"
            onClick={handleMakeStaff}
            disabled={loadingConfirm || !confirmation}
            variant="contained"
            color="primary"
            sx={{ marginRight: 2 }}
          >
            {loadingConfirm ? <CircularProgress size={24} color="inherit" /> : "Confirm as Staff"}
          </Button>
          <Button type="button" onClick={handleCancel} variant="outlined" color="secondary">
            Cancel
          </Button>
        </Box>
      </Box>
    )}
    {error && (
      <Typography variant="body2" color="error" sx={{ textAlign: "center", marginTop: 2 }}>
        {error}
      </Typography>
    )}
  </form>
</Box>
  );
}

export default AddStaff;
