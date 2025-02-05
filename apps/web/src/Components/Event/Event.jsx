import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEvent } from "../../AxiosApi/axiosApi";
import { useNavigate } from "react-router-dom";
import extractDateTimeDuration from "../../utils/dateConverter";
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CardMedia,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import placeholderImage from "../../assets/No-Image-Placeholder.svg";
import { useAuth } from "../Authentication/AuthContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { checkSubscribed, toggleSubscribe } from "../../AxiosApi/axiosApi";

function Event() {
  const [event, setEvent] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { eventid } = useParams();
  const navigate = useNavigate();
  const { user, showToast, logout } = useAuth();
  const [subscribeIsLoading, setsubscribeIsLoading] = useState(false);
  const [userIsSubscribed, setUserIsSubscribed] = useState(false);

  function authFailed() {
    logout();
    showToast("Your session has expired. Please log in again.");
  }

  useEffect(() => {
    setIsLoading(true);
    getEvent(eventid)
      .then(({ event }) => {
        setEvent(event);
        setIsLoading(false);
        const times = extractDateTimeDuration(event.date, event.end_date);
        const endDate = new Date(event.end_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        const endTime = new Date(event.end_date).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        const updatedEvent = {
          ...event,
          startDate: times.formattedDate,
          startTime: times.formattedTime,
          endDate,
          endTime,
        };
        setEvent(updatedEvent);
      })
      .catch((err) => {
        setIsLoading(false);
        navigate("/eventnotfound");
      });
  }, [eventid]);

  useEffect(() => {
    if (user) {
      checkSubscribed(eventid)
        .then(({ subscribed }) => {
          setUserIsSubscribed(subscribed);
        })
        .catch((err) => {
          setUserIsSubscribed(false);
        });
    } else setUserIsSubscribed(false);
  }, [user]);

  const handleToggleSubscribe = (e) => {
    e.preventDefault();
    if (user) {
      setsubscribeIsLoading(true);
      toggleSubscribe(eventid)
        .then(({ subscribed }) => {
          setUserIsSubscribed(subscribed);
          setsubscribeIsLoading(false);
        })
        .catch((err) => {
          if (err.message === "Invalid or expired token.") {
            authFailed();
          } else {
            showToast("An error occurred, please try again later.");
          }
          setsubscribeIsLoading(false);
        });
    }
  };

  if (isLoading) return <>Finding event...</>;

  return (
    <Box p={2}>
      <Card
        sx={{
          minHeight: "calc(100vh - 116px)",
          maxWidth: "100%",
          width: "100%",
          boxShadow: 3,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: { xs: "column", md: "row-reverse" },
            overflow: "hidden",
            wordWrap: "break-word",
            alignItems: "flex-start",
          }}
        >
          <CardMedia
            component="img"
            image={event.pictures?.[0] || placeholderImage}
            alt={event.title}
            sx={{
              objectFit: "contain",
              border: "2px solid #ccc",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "400px",
              minWidth: "250px",
              flexShrink: 0,
              alignSelf: { xs: "center", md: "flex-start" },
              height: "auto",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderImage;
            }}
          />

          <CardContent
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              wordWrap: "break-word",
              minWidth: "300px",
              textAlign: { xs: "center", md: "left" },
              flexGrow: 1,
              paddingTop: { xs: 2, md: 0 },
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ fontSize: "2rem" }}
            >
              {event.title}
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: "1.25rem" }}
            >
              {event.startDate} at {event.startTime}
              {event.startDate !== event.endDate &&
                ` - ${event.endDate} at ${event.endTime}`}
            </Typography>

            <Box
              display="flex"
              alignItems="center"
              mt={1}
              justifyContent={{ xs: "center", md: "flex-start" }}
            >
              <LocationOnIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                {event.location}
              </Typography>
            </Box>
          </CardContent>
        </CardContent>

        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            wordWrap: "break-word",
          }}
        >
          <Typography variant="body2" mt={2} sx={{ fontSize: "1.25rem" }}>
            {event.text}
          </Typography>

          <Box
            display="flex"
            gap={2}
            mt={3}
            justifyContent={{ xs: "center", md: "flex-start" }}
          >
            <Button
              variant="contained"
              startIcon={<LinkIcon />}
              href={event.fb_link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              disabled={!event.fb_link}
            >
              Facebook
            </Button>

            <Button
              variant="contained"
              startIcon={<LinkIcon />}
              href={event.instagram || "#"}
              target="_blank"
              rel="noopener noreferrer"
              disabled={!event.instagram}
            >
              Instagram
            </Button>
            <Button
              variant="contained"
              startIcon={userIsSubscribed ? <RemoveIcon /> : <AddIcon />}
              onClick={handleToggleSubscribe}
              target="_blank"
              rel="noopener noreferrer"
              disabled={!user || subscribeIsLoading}
            >
              {subscribeIsLoading ? "Loading..." : "Subscribe"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Event;
