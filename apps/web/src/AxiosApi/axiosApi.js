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

export function getUserByEmail(email) {
  return request
    .get(`/user/details?email=${email}`)
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      if (err.response) {
        if ((err.response.msg = "No user found with this email.")) {
          return {};
        }
        throw new Error(
          err.response.data?.msg || "An error occurred during the request."
        );
      } else {
        throw new Error(
          "An unexpected error occurred. Please try again later."
        );
      }
    });
}

export function patchStaffStatus(userid) {
  return request
    .patch(`/user/details/makestaff/${userid}`)
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      if (err.response) {
        throw new Error(
          err.response.data?.msg || "An error occurred during the request."
        );
      } else {
        throw new Error(
          "An unexpected error occurred. Please try again later."
        );
      }
    });
}

export function postEvent({
  title,
  location,
  description,
  startDate,
  startTime,
  endDate,
  endTime,
  fbEvent,
  instaLink,
  image,
}) {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("location", location);
  formData.append("description", description);
  formData.append("startDate", startDate);
  formData.append("startTime", startTime);
  formData.append("endDate", endDate);
  formData.append("endTime", endTime);
  formData.append("fbEvent", fbEvent);
  formData.append("instaLink", instaLink);

  if (image) {
    formData.append("image", image);
  }
  return request
    .post("/events", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      if (err.response) {
        throw new Error(
          err.response.data?.msg || "An error occurred during the request."
        );
      } else {
        throw new Error(
          "An unexpected error occurred. Please try again later."
        );
      }
    });
}

export function patchStaff() {
  return request
    .patch("/user/details/revokestaff")
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      if (err.response) {
        throw new Error(
          err.response.data?.msg || "An error occurred during the request."
        );
      } else {
        throw new Error(
          "An unexpected error occurred. Please try again later."
        );
      }
    });
}

export function getEvent(eventid) {
  return request
    .get(`/event/${eventid}`)
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      if (err.response) {
        throw new Error(
          err.response.data?.msg || "An error occurred during the request."
        );
      } else {
        throw new Error(
          "An unexpected error occurred. Please try again later."
        );
      }
    });
}

export function checkSubscribed(eventid) {
  return request
    .get(`/event/checkSubscribed/${eventid}`)
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      if (err.response) {
        throw new Error(
          err.response.data?.msg || "An error occurred during the request."
        );
      } else {
        throw new Error(
          "An unexpected error occurred. Please try again later."
        );
      }
    });
}

export function toggleSubscribe(eventid) {
  return request
    .patch(`/event/toggleSubscribed/${eventid}`)
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      if (err.response) {
        throw new Error(
          err.response.data?.msg || "An error occurred during the request."
        );
      } else {
        throw new Error(
          "An unexpected error occurred. Please try again later."
        );
      }
    });
}

export function deleteEvent(eventid) {
  return request
    .delete(`/event/${eventid}`)
    .then((response) => {})
    .catch((err) => {
      if (err.response) {
        throw new Error(
          err.response.data?.msg || "An error occurred during the request."
        );
      } else {
        throw new Error(
          "An unexpected error occurred. Please try again later."
        );
      }
    });
}
