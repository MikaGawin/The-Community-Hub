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

  useEffect(() => {
    setIsLoading(true);
    getUserEvents(user.user_id).then((data) => {
      if (data === "failed to connect to server") {
        setConnectSuccess(false);
      } else if (data.events){
        setEventsData(data);
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
