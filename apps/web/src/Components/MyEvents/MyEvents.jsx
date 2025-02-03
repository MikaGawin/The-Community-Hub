import { useEffect, useState } from "react";
import EventCard from "./MyEventCard";
import { getUserEvents } from "../../AxiosApi/axiosApi";
import { useAuth } from "../Authentication/AuthContext";

import ConnectionFailed from "../ErrorFeedback/ConnectionFailed";

function Events() {
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
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!connectSuccess) {
    return <ConnectionFailed />;
  }

  return (
    <>
      <div id="result-count">
        {isLoading ? (
          <>Finding events</>
        ) : (
          <h1>Showing your subscribed events</h1>
        )}
      </div>
      <div>
        <ul>
          {eventsData.events.length > 0 ? (
            eventsData.events.map((event) => (
              <EventCard key={event.event_id} event={event} />
            ))
          ) : (
            <p>No events available.</p>
          )}
        </ul>
      </div>
    </>
  );
}

export default Events;
