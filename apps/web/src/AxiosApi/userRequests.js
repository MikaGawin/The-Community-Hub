import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:9090/",
});

export function postUser(user) {
  return request.post("/users", user).then(({ data }) => {
    console.log(data);
    return data;
  });
}
