import { useState } from "react";
import { postUser } from "../../AxiosApi/axiosApi";
import { useNavigate } from "react-router";
import { Box, TextField, Button, CircularProgress, Typography } from "@mui/material";


function UserCreateForm() {
  const [userInput, setUserInput] = useState({
    Forename: "",
    Surname: "",
    Email: "",
    Password: "",
    RepeatPassword: "",
  });
  const [hasEmailError, setHasEmailError] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [hasPasswordError, setHasPasswordError] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [hasRepeatPasswordError, setHasRepeatPasswordError] = useState(false);
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [hasForenameError, setHasForenameError] = useState(false);
  const [forenameError, setForenameError] = useState(false);
  const [hasSurnameError, setHasSurnameError] = useState(false);
  const [surnameError, setSurnameError] = useState(false);
  const [createUserIsProcessing, setCreateUserIsProcessing] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required.");
      setHasEmailError(true);
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      setHasEmailError(true);
      return false;
    } else {
      setHasEmailError(false);
      return true;
    }
  };

  const validateForename = (forename) => {
    const nameRegex = /^[A-Za-z]+$/;
    if (!forename) {
      setForenameError("Forename is required.");
      setHasForenameError(true);
      return false;
    } else if (forename.length > 30) {
      setForenameError("Forename is too long.");
      setHasForenameError(true);
      return false;
    } else if (!nameRegex.test(forename)) {
      setForenameError("Forename should only contain letters.");
      setHasForenameError(true);
      return false;
    } else {
      setHasForenameError(false);
      return true;
    }
  };

  const validateSurname = (surname) => {
    const nameRegex = /^[A-Za-z]+$/;
    if (!surname) {
      setSurnameError("Surname is required.");
      setHasSurnameError(true);
      return false;
    } else if (surname.length > 30) {
      setSurnameError("Surname is too long");
      setHasSurnameError(true);
      return false;
    } else if (!nameRegex.test(surname)) {
      setSurnameError("Surname should only contain letters.");
      setHasSurnameError(true);
      return false;
    } else {
      setHasSurnameError(false);
      return true;
    }
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/;
    if (!password) {
      setPasswordError("Password is required.");
      setHasPasswordError(true);
      return false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      setHasPasswordError(true);
      return false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must include at least one number and one symbol."
      );
      setHasPasswordError(true);
      return false;
    } else {
      setHasPasswordError(false);
      return true;
    }
  };

  const validateRepeatPassword = (repeatPassword, password) => {
    if (repeatPassword !== password) {
      setRepeatPasswordError("Passwords do not match.");
      setHasRepeatPasswordError(true);
      return false;
    } else {
      setHasRepeatPasswordError(false);
      return true;
    }
  };

  function handleChange(event) {
    setUserInput((currentInputs) => ({
      ...currentInputs,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setConnectionError(false);
    let valid =
      validatePassword(userInput.Password) &&
      validateEmail(userInput.Email) &&
      validateForename(userInput.Forename) &&
      validateSurname(userInput.Surname) &&
      validateRepeatPassword(userInput.RepeatPassword, userInput.Password)
        ? true
        : false;

    const newUser = {
      forename: userInput.Forename,
      surname: userInput.Surname,
      email: userInput.Email,
      password: userInput.Password,
    };
    if (valid) {
      setCreateUserIsProcessing(true);
      postUser(newUser).then((data) => {
        if (data.response) {
          if (data.response.data.msg === "Email already exists") {
            setHasEmailError(true);
            setEmailError("Email already exists");
          }
        } else if (data === "failed to connect to server") {
          setConnectionError(true);
        } else {
          setUserInput({
            Forename: "",
            Surname: "",
            Email: "",
            Password: "",
            RepeatPassword: "",
          });
          navigate("/login");
        }
        setCreateUserIsProcessing(false);
      });
    }
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
          marginTop:{xs:0, sm: "1rem", md:"5rem"}
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2, textAlign: "center" }}>
          Create Account
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              value={userInput.Forename}
              onChange={handleChange}
              type="text"
              id="Forename"
              name="Forename"
              label="Forename"
              fullWidth
              error={hasForenameError}
              helperText={hasForenameError ? forenameError : ""}
            />
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              value={userInput.Surname}
              onChange={handleChange}
              type="text"
              id="Surname"
              name="Surname"
              label="Surname"
              fullWidth
              error={hasSurnameError}
              helperText={hasSurnameError ? surnameError : ""}
            />
          </Box>
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
              helperText={hasPasswordError ? passwordError : ""}
            />
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              value={userInput.RepeatPassword}
              onChange={handleChange}
              type="password"
              id="RepeatPassword"
              name="RepeatPassword"
              label="Repeat Password"
              fullWidth
              error={hasRepeatPasswordError}
              helperText={hasRepeatPasswordError ? repeatPasswordError : ""}
            />
          </Box>
          <Box sx={{ textAlign: "center", marginBottom: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={createUserIsProcessing}
            >
              {createUserIsProcessing ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Submit"
              )}
            </Button>
          </Box>
        </form>

        {connectionError && (
          <Typography variant="body2" color="error" sx={{ textAlign: "center", marginTop: 2 }}>
            An error occurred. Please try again.
          </Typography>
        )}
      </Box>

  );
}

export default UserCreateForm;
