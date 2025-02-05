import { useEffect } from "react";
import { useAuth } from "../Authentication/AuthContext";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Button } from "@mui/material";
const AddToCalendarButton = ({ event }) => {
  const { user, showToast } = useAuth();
  useEffect(() => {
    const loadGis = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    loadGis();
  }, []);
  const addToCalendar = async () => {
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: "https://www.googleapis.com/auth/calendar.events",
      callback: async (response) => {
        if (response.error) {
          console.error("OAuth Error:", response);
          return;
        }

        const calendarEvent = {
          summary: event.title,
          description: event.description,
          start: { dateTime: event.date, timeZone: "UTC" },
          end: { dateTime: event.end_date, timeZone: "UTC" },
          location: event.location,
        };

        try {
          const res = await fetch(
            "https://www.googleapis.com/calendar/v3/calendars/primary/events",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${response.access_token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(calendarEvent),
            }
          );

          if (!res.ok) throw new Error("Failed to add event");
          console.log(res);
          alert("Event added to your Google Calendar!");
        } catch (error) {
          console.error("Error adding event:", error);
        }
      },
    });

    tokenClient.requestAccessToken();
  };

  return (
    // <button onClick={addToCalendar}>Add to Google Calendar</button>;
    <Button
      variant="contained"
      startIcon={<CalendarMonthIcon />}
      onClick={addToCalendar}
      target="_blank"
      rel="noopener noreferrer"
      disabled={!user}
    >
      Add to Google Calendar
    </Button>
  );
};

export default AddToCalendarButton;
