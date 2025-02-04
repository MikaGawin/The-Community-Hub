import { useState } from "react";
import { useAuth } from "../Authentication/AuthContext";
import { changePassword } from "../../AxiosApi/axiosApi";
import { CircularProgress } from "@mui/material";
import StaffStatus from "./staffStatus";

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
      //send api request
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
    <div>
      <h2>Account Details</h2>
      <p>Email: {user?.email}</p>
      {!isEditingName ? (
        <>
          <p>
            Name: {forename} {surname}
          </p>
          {/* <button onClick={() => setIsEditingName(true)}>Update Name</button> */}
        </>
      ) : (
        <form onSubmit={handleUpdateName}>
          <input
            type="text"
            placeholder="Forename"
            value={forename}
            onChange={(e) => setForename(e.target.value)}
          />
          <input
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
          {nameError && <p style={{ color: "red" }}>{nameError}</p>}
          <button type="submit">Save Name</button>
        </form>
      )}
      <hr />
      {!isChangingPassword ? (
        <button
          onClick={() => {
            setIsChangingPassword(true);
            setsuccessMessage("");
          }}
        >
          Change Password
        </button>
      ) : (
        <form onSubmit={handleChangePassword}>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit">
            {passwordUpdating === true ? (
              <CircularProgress size={20} />
            ) : (
              <>Save password</>
            )}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsChangingPassword(false);
            }}
            >
            <>Cancel</>
          </button>
            {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
        </form>
      )}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {user.staff && (
        <div>
          <hr />
          <StaffStatus user={user} />
        </div>
      )}
    </div>
  );
}

export default Account;
