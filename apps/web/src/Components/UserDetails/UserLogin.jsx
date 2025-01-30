import { useState } from "react";
import { requestUserToken } from "../../AxiosApi/axiosApi";
import { useAuth } from "../Authentication/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CircularProgress } from "@mui/material";

function UserLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [userInput, setUserInput] = useState({
    // Email: "",
    // Password: "",
    Email: "alice@example.com",
    Password: "hashed_password_123",
  });
  const [loginError, setLoginError] = useState(null);
  const [hasEmailError, setHasEmailError] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [hasPasswordError, setHasPasswordError] = useState(false);
  const [loginIsProcessing, setLoginIsProcessing] = useState(false);

  function handleChange(event) {
    if (event.target.name === "Password") {
      setHasPasswordError(false);
    } else if (event.target.name === "Email") {
      setHasEmailError(false);
    }
    setUserInput((currentInputs) => ({
      ...currentInputs,
      [event.target.name]: event.target.value,
    }));
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required.");
      setHasEmailError(true);
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      setHasEmailError(true);
    }
  };

  function handleSubmit(event) {
    event.preventDefault();
    setLoginIsProcessing(true);
    validateEmail(userInput.Email);
    if (hasEmailError || !userInput.Password) {
      if (!userInput.Password) {
        setHasPasswordError(true);
      }
      setLoginIsProcessing(false);
      return;
    }
    requestUserToken(userInput.Email, userInput.Password).then((data) => {
      if (data.response) {
        if (data.response.data.msg === "User not found") {
          setLoginError("User not found");
        } else if (data.response.data.msg === "Incorrect password") {
          setLoginError("Incorrect password");
        } else {
          //send to something went wrong page
        }
      } else {
        login(data.user, data.token);
        const redirectPath = location.state?.from?.pathname || "/";
        navigate(redirectPath, { replace: true });
      }
      setLoginIsProcessing(false);
    });
  }

  return (
    <>
      <h1>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              value={userInput.Email}
              onChange={handleChange}
              id="Email"
              name="Email"
              placeholder="Email"
            />
            {hasEmailError ? <>{emailError}</> : null}
          </div>
          <div>
            <input
              value={userInput.Password}
              onChange={handleChange}
              type="password"
              id="Password"
              name="Password"
              placeholder="Password"
            />
            {hasPasswordError ? <>Password is required</> : null}
          </div>
          {loginError ? <p>{loginError}</p> : null}
          <button>
            {loginIsProcessing === true ? (
              <CircularProgress size={20} />
            ) : (
              <>Submit</>
            )}
          </button>
        </form>
        <Link to="/signup">Sign Up</Link>
      </h1>
    </>
  );
}

export default UserLogin;
