import React, { useState } from "react";
import { getUserByEmail, patchStaffStatus } from "../../AxiosApi/axiosApi";
import { useAuth } from "../Authentication/AuthContext";

function AddStaff() {
  const [email, setEmail] = useState("");
  const { loading, logout, showToast } = useAuth();
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
        setUserFetchError(err.message);
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
          setLoadingConfirm(false);
          setUserFetchError("An error occurred, please try again later.");
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
    <div>
      <h2>Add Staff</h2>
      <form>
        <div>
          <label htmlFor="email">Enter Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter user email"
          />
          <button
            type="button"
            onClick={handleFetchUser}
            disabled={loadingUser}
          >
            {loadingUser ? "Loading..." : "Find User"}
          </button>
          {emailError && <p style={{ color: "red" }}>{emailError}</p>}
          {userFetchError && <p style={{ color: "red" }}>{userFetchError}</p>}
        </div>

        {userName && (
          <div>
            <p>Name associated with email: {userName}</p>
            <div>
              <input
                type="checkbox"
                id="confirm"
                checked={confirmation}
                onChange={(e) => setConfirmation(e.target.checked)}
              />
              <label htmlFor="confirm">I am sure</label>
            </div>
            <div>
              <button
                type="button"
                onClick={handleMakeStaff}
                disabled={loadingConfirm}
              >
                {loadingConfirm ? "Loading..." : "Confirm as Staff"}
              </button>
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

export default AddStaff;
