import { useState } from "react";
import { useAuth } from "../Authentication/AuthContext";
import { changePassword } from "../../AxiosApi/axiosApi";
import StaffStatus from "./staffStatus";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
function Account() {
  const { user, loading, logout, showToast } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [forename, setForename] = useState(user?.forename || "");
  const [surname, setSurname] = useState(user?.surname || "");
  const [nameError, setNameError] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setsuccessMessage] = useState("");
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  function authFailed() {
    logout();
    showToast("Your session has expired. Please log in again.");
  }

  const validateName = () => {
    if (!forename.trim() || !surname.trim()) {
      setNameError("Forename and surname are required.");
      return false;
    }
    setNameError("");
    return true;
  };

  const validatePassword = () => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!newPassword.match(passwordRegex)) {
      setPasswordError(
        "Password must be at least 8 characters, include an uppercase letter, a number, and a special character."
      );
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleUpdateName = (e) => {
    e.preventDefault();
    if (validateName()) {
      console.log("Name updated:", { forename, surname });
      setIsEditingName(false);
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (validatePassword()) {
      setPasswordUpdating(true);
      changePassword(oldPassword, newPassword, user.user_id)
        .then((response) => {
          if (response.status === 204) {
            setsuccessMessage("Password changed successfully!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setIsChangingPassword(false);
          } else {
            if (response.message === "Invalid or expired token.") {
              authFailed();
            } else {
              setPasswordError(response.message);
            }
          }
          setPasswordUpdating(false);
        })
        .catch((err) => {
          setPasswordError("An error occurred. Please try again.");
          setPasswordUpdating(false);
        });
    }
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
        marginTop: { xs: 0, sm: "1rem", md: "3rem" },
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 2, textAlign: "center" }}>
        Account Details
      </Typography>

      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        Email: {user?.email}
      </Typography>

      {!isEditingName ? (
        <>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Name: {forename} {surname}
          </Typography>
          {/* <button onClick={() => setIsEditingName(true)}>Update Name</button> */}
        </>
      ) : (
        <form onSubmit={handleUpdateName}>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              type="text"
              placeholder="Forename"
              value={forename}
              onChange={(e) => setForename(e.target.value)}
              fullWidth
            />
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              type="text"
              placeholder="Surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              fullWidth
            />
          </Box>
          {nameError && (
            <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
              {nameError}
            </Typography>
          )}
          <Box sx={{ textAlign: "center" }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Save Name
            </Button>
          </Box>
        </form>
      )}

      <hr style={{ margin: "1rem 0" }} />

      {!isChangingPassword ? (
        <Box sx={{ textAlign: "center" }}>
          <Button
            onClick={() => {
              setIsChangingPassword(true);
              setSuccessMessage("");
            }}
            variant="outlined"
            color="primary"
          >
            Change Password
          </Button>
        </Box>
      ) : (
        <form onSubmit={handleChangePassword}>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              fullWidth
            />
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
            />
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
            />
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={passwordUpdating}
            >
              {passwordUpdating ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Save Password"
              )}
            </Button>
          </Box>
          <Box sx={{ textAlign: "center", marginTop: 2 }}>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setIsChangingPassword(false);
              }}
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
          </Box>
          {passwordError && (
            <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
              {passwordError}
            </Typography>
          )}
        </form>
      )}

      {successMessage && (
        <Typography variant="body2" color="success" sx={{ marginTop: 2 }}>
          {successMessage}
        </Typography>
      )}

      {user.staff && (
        <Box sx={{ marginTop: 3 }}>
          <hr />
          <StaffStatus user={user} />
        </Box>
      )}
    </Box>
  );
}

export default Account;
