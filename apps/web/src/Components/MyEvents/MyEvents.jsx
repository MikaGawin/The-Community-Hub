import { useEffect, useState } from "react";
import EventCard from "./MyEventCard";
import { getUserEvents } from "../../AxiosApi/axiosApi";
import { useAuth } from "../Authentication/AuthContext";
import ConnectionFailed from "../ErrorFeedback/ConnectionFailed";
import { Box, Typography, Grid } from "@mui/material";

function MyEvents() {
  const { user, loading, logout, showToast } = useAuth();
  const [eventsData, setEventsData] = useState({
    events: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [connectSuccess, setConnectSuccess] = useState(true);

  function authFailed() {
    logout();
    showToast("Your session has expired. Please log in again.");
  }

  useEffect(() => {
    setIsLoading(true);
    getUserEvents(user.user_id).then((data) => {
      if (data.events) {
        setEventsData(data);
      } else if (data.message === "Invalid or expired token.") {
        authFailed();
      } else {
        setConnectSuccess(false);
      }
      setIsLoading(false);
    });
  }, [user.user_id]);

  if (loading) return <p>Loading...</p>;

  if (!connectSuccess) {
    return <ConnectionFailed />;
  }

  return (
    <>
      <Box
        sx={{
          width: "100%",
          justifyContent: "flex-end",
          borderBottom: "1px solid #ddd",
          padding: 2,
          margin: "0",
          backgroundColor: "grey.300",
          boxSizing: "border-box",
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          textAlign: "center",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "flex-end" },
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography variant="body1" fontWeight="bold">
            Showing your subscribed events
          </Typography>
        </Box>
      </Box>

      <Box p={2}>
        <Typography variant="body1" sx={{ flex: "1 1 auto", minWidth: "250px" }}>
          {isLoading ? "Finding events..." : ""}
        </Typography>

        <Grid container spacing={3} justifyContent="flex-start">
          {eventsData.events.length > 0 ? (
            eventsData.events.map((event) => (
              <Grid
                item
                key={event.event_id}
                lg={3}
                xs={12}
                sm={6}
                md={4}
                sx={{
                  minWidth: "320px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <EventCard event={event} />
              </Grid>
            ))
          ) : (
            <Typography variant="body2" sx={{ textAlign: "center", width: "100%" }}>
              No events available.
            </Typography>
          )}
        </Grid>
      </Box>
    </>
  );
}

export default MyEvents;