import { useState } from "react";
import { postUser } from "../../AxiosApi/axiosApi";

function UserCreateForm() {
  const [userInput, setUserInput] = useState({
    Forename: "",
    Surname: "",
    Email: "",
    Password: "",
  });

  function handleChange(event) {
    setUserInput((currentInputs) => ({
      ...currentInputs,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    //first check if valid
    const newUser = {
      forename: userInput.Forename,
      surname: userInput.Surname,
      email: userInput.Email,
      password: userInput.Password,
    };
    postUser(newUser).then(
      setUserInput({
        Forename: "",
        Surname: "",
        Email: "",
        Password: "",
      })
    );
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
              required
            />
          </div>
          <div>
            <input
              value={userInput.Surname}
              onChange={handleChange}
              type="text"
              id="Surname"
              name="Surname"
              placeholder="Surname"
              required
            />
          </div>
          <div>
            <input
              value={userInput.Email}
              onChange={handleChange}
              type="email"
              id="Email"
              name="Email"
              placeholder="Email"
              required
            />
          </div>
          <div>
            <input
              value={userInput.Password}
              onChange={handleChange}
              type="text"
              id="Password"
              name="Password"
              placeholder="Password"
              required
            />
          </div>
          <button>Submit</button>
        </form>
      </h1>
    </>
  );
}

export default UserCreateForm;
