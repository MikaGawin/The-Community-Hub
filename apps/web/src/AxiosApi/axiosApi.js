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
  return request
    .post("/register", user)
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      if (err.response) {
        return err;
      } else {
        //send to something went wrong page
        console.log(err);
      }
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
        console.log(err);
      }
    });
}

export function getEvents({
  page = 1,
  sort_by,
  search,
  startDate,
  endDate,
  sortOrder,
  resultsPerPage,
}) {
  const queries = {
    params: {
      page,
      sort_by,
      search,
      startDate,
      latestDate: endDate,
      sortOrder,
      limit: resultsPerPage,
    },
  };
  return request
    .get("/events", queries)
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      //send to something went wrong page
      console.log(err);
    });
}
