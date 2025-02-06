import { useState } from "react";
import { requestUserToken } from "../../AxiosApi/axiosApi";
import { useAuth } from "../Authentication/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

function UserLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [userInput, setUserInput] = useState({
    Email: "",
    Password: "",
  });
  const [loginError, setLoginError] = useState(null);
  const [hasEmailError, setHasEmailError] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [connectionError, setConnectionError] = useState(false);
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
    setConnectionError(false);
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
      } else if (data === "failed to connect to server") {
        setConnectionError(true);
      } else {
        login(data.user, data.token);
        const redirectPath = location.state?.from?.pathname || "/";
        navigate(redirectPath, { replace: true });
      }
      setLoginIsProcessing(false);
    });
  }

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
        Sign In
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            value={userInput.Email}
            onChange={handleChange}
            id="Email"
            name="Email"
            label="Email"
            fullWidth
            error={hasEmailError}
            helperText={hasEmailError ? emailError : ""}
          />
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            value={userInput.Password}
            onChange={handleChange}
            type="password"
            id="Password"
            name="Password"
            label="Password"
            fullWidth
            error={hasPasswordError}
            helperText={hasPasswordError ? "Password is required" : ""}
          />
        </Box>
        {loginError && (
          <Typography
            variant="body2"
            color="error"
            sx={{ textAlign: "center", marginTop: 2 }}
          >
            {loginError}
          </Typography>
        )}
        <Box sx={{ textAlign: "center", marginBottom: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loginIsProcessing}
          >
            {loginIsProcessing ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Submit"
            )}
          </Button>
        </Box>
        {connectionError && (
          <Typography
            variant="body2"
            color="error"
            sx={{ textAlign: "center", marginTop: 2 }}
          >
            Failed to connect to the server. Please try again later.
          </Typography>
        )}
      </form>
      <Typography variant="body2" sx={{ textAlign: "center", marginTop: 2 }}>
        <Link to="/signup">Sign Up</Link>
      </Typography>
    </Box>
  );
}

export default UserLogin;
