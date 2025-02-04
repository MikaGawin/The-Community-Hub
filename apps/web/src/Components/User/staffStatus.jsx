import { useAuth } from "../Authentication/AuthContext";
import { useState } from "react";
import { patchStaff } from "../../AxiosApi/axiosApi";

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

  if (user.user_id === 1) {
    return <p>Super user enabled</p>;
  }

  return (
    <div>
      <p>Staff permissions enabled</p>
      <button onClick={handleRevokeClick}>Give Up Staff Permissions</button>
      {showConfirm && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <p>Are you sure you want to give up staff permissions?</p>
          <label>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            Yes, I am sure
          </label>
          <br />
          <button onClick={handleConfirm} disabled={!isChecked}>
            {isPatching ? "Loading..." : "Proceed"}
          </button>
          <button onClick={handleCancel}>Cancel</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}
    </div>
  );
}

export default StaffStatus;
