import React from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import extractDateTimeDuration from "../../utils/dateConverter";
import placeholderImage from "../../assets/No-Image-Placeholder.svg";
import { useNavigate } from "react-router";

export default function EventCard({event}) {
    const times = extractDateTimeDuration(event.date, event.end_date);
  const navigate = useNavigate();

  function goToEvent(e) {
    e.preventDefault();
    navigate(`/event/${event.event_id}`);
  }

  return (
    <Box 
      sx={{ cursor: "pointer" }} 
      onClick={goToEvent}
    >
      <Card
        sx={{
          boxShadow: 3,
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "320px",
          width: "300px",
          margin: "15px",
        }}
      >
        <CardMedia
          component="img"
          image={event.pictures?.[0] || placeholderImage}
          alt={event.title}
          sx={{
            objectFit: "cover",
            borderRadius: "8px",
            width: "100%",
            height: "150px",
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImage;
          }}
        />

        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            {event.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {times.formattedDate} at {times.formattedTime}
          </Typography>
          <Box display="flex" alignItems="center" mt={1}>
            <LocationOnIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2">{event.location}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}