import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:9090/",
});

request.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export function postUser(user) {
  return request.post("/users", user).then(({ data }) => {
    console.log(data);
    return data;
  });
}

export function requestUserToken(email, password) {
  return request
    .post("/login", { email, password })
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      if (err.response) {
        return err;
      } else {
        //send to something went wrong page
        console.log(err)
      }
    });
}
