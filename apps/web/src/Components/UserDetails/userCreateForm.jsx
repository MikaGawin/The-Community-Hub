import { useState } from "react";
import { postUser } from "../../AxiosApi/axiosApi";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router";

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
  const [hasRepeatPasswordError, setHasRepeatPasswordError] = useState(false); // State for repeat password error
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [hasForenameError, setHasForenameError] = useState(false);
  const [forenameError, setForenameError] = useState(false);
  const [hasSurnameError, setHasSurnameError] = useState(false);
  const [surnameError, setSurnameError] = useState(false);
  const [createUserIsProcessing, setCreateUserIsProcessing] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required.");
      setHasEmailError(true);
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      setHasEmailError(true);
    } else {
      setHasEmailError(false);
    }
  };

  const validateForename = (forename) => {
    const nameRegex = /^[A-Za-z]+$/;
    if (!forename) {
      setForenameError("Forename is required.");
      setHasForenameError(true);
    } else if (forename.length > 30) {
      setForenameError("Forename is too long.");
      setHasForenameError(true);
    } else if (!nameRegex.test(forename)) {
      setForenameError("Forename should only contain letters.");
      setHasForenameError(true);
    } else {
      setHasForenameError(false);
    }
  };

  const validateSurname = (surname) => {
    const nameRegex = /^[A-Za-z]+$/;
    if (!surname) {
      setSurnameError("Surname is required.");
      setHasSurnameError(true);
    } else if (surname.length > 30) {
      setSurnameError("Surname is too long");
      setHasSurnameError(true);
    } else if (!nameRegex.test(surname)) {
      setSurnameError("Surname should only contain letters.");
      setHasSurnameError(true);
    } else {
      setHasSurnameError(false);
    }
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/;
    if (!password) {
      setPasswordError("Password is required.");
      setHasPasswordError(true);
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      setHasPasswordError(true);
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must include at least one number and one symbol."
      );
      setHasPasswordError(true);
    } else {
      setHasPasswordError(false);
    }
  };

  const validateRepeatPassword = (repeatPassword, password) => {
    if (repeatPassword !== password) {
      setRepeatPasswordError("Passwords do not match.");
      setHasRepeatPasswordError(true);
    } else {
      setHasRepeatPasswordError(false);
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
    validatePassword(userInput.Password);
    validateEmail(userInput.Email);
    validateForename(userInput.Forename);
    validateSurname(userInput.Surname);
    validateRepeatPassword(userInput.RepeatPassword, userInput.Password);
    const newUser = {
      forename: userInput.Forename,
      surname: userInput.Surname,
      email: userInput.Email,
      password: userInput.Password,
    };
    if (
      !hasEmailError &&
      !hasForenameError &&
      !hasSurnameError &&
      !hasPasswordError &&
      !hasRepeatPasswordError
    ) {
      setCreateUserIsProcessing(true);
      postUser(newUser).then((data) => {
        if (data.response) {
          if (data.response.data.msg === "Email already exists") {
            setHasEmailError(true);
            setEmailError("Email already exists");
          } else {
            //send to something went wrong page
          }
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
    <>
      <h1>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              value={userInput.Forename}
              onChange={handleChange}
              type="text"
              id="Forename"
              name="Forename"
              placeholder="Forename"
            />
            {hasForenameError ? <>{forenameError}</> : null}
          </div>
          <div>
            <input
              value={userInput.Surname}
              onChange={handleChange}
              type="text"
              id="Surname"
              name="Surname"
              placeholder="Surname"
            />
            {hasSurnameError ? <>{surnameError}</> : null}
          </div>
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
            {hasPasswordError ? <>{passwordError}</> : null}
          </div>
          <div>
            <input
              value={userInput.RepeatPassword}
              onChange={handleChange}
              type="password"
              id="RepeatPassword"
              name="RepeatPassword"
              placeholder="Repeat Password"
            />
            {hasRepeatPasswordError ? <>{repeatPasswordError}</> : null}
          </div>
          <button>
            {createUserIsProcessing === true ? (
              <CircularProgress size={20} />
            ) : (
              <>Submit</>
            )}
          </button>
        </form>
      </h1>
    </>
  );
}

export default UserCreateForm;
