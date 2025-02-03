import axios from "axios";
import { useAuth } from "../Components/Authentication/AuthContext";

const request = axios.create({
  baseURL: "http://localhost:9090/",
});

request.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.authorization = `Bearer ${token}`;
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
        return "failed to connect to server";
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
        return "failed to connect to server";
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
      return "failed to connect to server";
      console.log(err);
    });
}

export function changePassword(currentPassword, newPassword, userid) {
  return request
    .patch(`/user/password/${userid}`, { currentPassword, newPassword })
    .then(({ data, status }) => {
      return { data, status };
    })
    .catch((err) => {
      if (err.response) {
        return {
          status: err.response.status,
          message:
            err.response.data?.msg || "An error occurred during the request.",
        };
      } else {
        return {
          status: 500,
          message: "Failed to connect to server. Please try again later.",
        };
      }
    });
}

export function getUserEvents(userId) {
  return request
    .get(`/user/events/${userId}`)
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      if (err.response) {
        return {
          status: err.response.status,
          message:
            err.response.data?.msg || "An error occurred during the request.",
        };
      } else {
        return {
          status: 500,
          message: "Failed to connect to server. Please try again later.",
        };
      }
    });
}
