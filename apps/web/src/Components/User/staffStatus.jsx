import { useAuth } from "../Authentication/AuthContext";
import { useState } from "react";
import { patchStaff } from "../../AxiosApi/axiosApi";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Typography,
} from "@mui/material";

function StaffStatus() {
  const { user, loading, logout, showToast } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isPatching, setIsPatching] = useState(false);
  const [error, setError] = useState(null);
  function authFailed() {
    logout();
    showToast("Your session has expired. Please log in again.");
  }

  const handleRevokeClick = () => {
    setShowConfirm(true);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setIsChecked(false);
    setError(null);
  };

  const handleConfirm = () => {
    if (isChecked) {
      setError(null);
      setIsPatching(true);
      patchStaff()
        .then((data) => {
          setIsPatching(false);
          setShowConfirm(false);
          logout();
          showToast("Staff permissions revoked. Please log in again.");
        })
        .catch((err) => {
          if (err.message === "Invalid or expired token.") {
            authFailed();
          } else {
            setError("An error occurred, please try again later.");
          }
          setIsPatching(false);
        });
    }
  };

  return (
    <>
      <Typography variant="h5" sx={{ marginBottom: 2, textAlign: "center" }}>
        Staff Status
      </Typography>

      {user.user_id === 1 ? (
        <Typography variant="body1" color="success" textAlign="center">
          Super user enabled
        </Typography>
      ) : (
        <>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ marginBottom: 2 }}
          >
            Staff permissions enabled
          </Typography>

          {!showConfirm ? (
            <Box sx={{ textAlign: "center" }}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleRevokeClick}
              >
                Give Up Staff Permissions
              </Button>
            </Box>
          ) : (
            <>
              <Typography
                variant="body2"
                textAlign="center"
                sx={{ marginBottom: 2 }}
              >
                Are you sure you want to give up staff permissions?
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Checkbox
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
                <Typography variant="body2">Yes, I am sure</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  marginTop: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleConfirm}
                  disabled={!isChecked || isPatching}
                >
                  {isPatching ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Proceed"
                  )}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Box>

              {error && (
                <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
                  {error}
                </Typography>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

export default StaffStatus;
