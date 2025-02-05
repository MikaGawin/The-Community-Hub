import { useEffect } from "react";

const AddToCalendarButton = ({ event }) => {
  useEffect(() => {
    const loadGapi = () => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.onload = () => window.gapi.load("client:auth2", initGapi);
      document.body.appendChild(script);
    };

    const initGapi = async () => {
      console.log("test", import.meta.env);
      console.log("API Key:", import.meta.env.VITE_GOOGLE_API_KEY);
      console.log("Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
      await window.gapi.client.init({
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
        ],
        scope: "https://www.googleapis.com/auth/calendar.events",
      });
    };

    loadGapi();
  }, []);

  const addToCalendar = async () => {
    const authInstance = window.gapi.auth2.getAuthInstance();
    if (!authInstance.isSignedIn.get()) {
      await authInstance.signIn();
    }

    const calendarEvent = {
      summary: event.title,
      description: event.description,
      start: { dateTime: event.start, timeZone: "UTC" },
      end: { dateTime: event.end, timeZone: "UTC" },
      location: event.location,
    };

    await window.gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: calendarEvent,
    });

    alert("Event added to your Google Calendar!");
  };

  return <button onClick={addToCalendar}>Add to Google Calendar</button>;
};

export default AddToCalendarButton;
