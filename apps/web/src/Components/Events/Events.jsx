import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router";
import EventCard from "./EventCard";
import sortOptions from "../../utils/sortOptions";
import { getEvents } from "../../AxiosApi/axiosApi";
import PageSetter from "./PageSetter";
import DateSelecter from "./DateSelecter"

function Events() {
    const { search } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const resultsPerPage = 20;
    const [eventsData, setEventsData] = useState({
        events: [],
        eventCount: 0,
    });
    
    const [sortedBy, setSortedBy] = useState({
      sortByText: "Event Date",
      orderText: "Soonest - Furthest",
      order: "asc",
      sort_by: "date",
    });

    const [startDate, setStartDate] = useState(
        searchParams.get("startDate") ? new Date(searchParams.get("startDate")) : null
      );
      const [endDate, setEndDate] = useState(
        searchParams.get("endDate") ? new Date(searchParams.get("endDate")) : null
      );
  
      function handleDateChange(newStartDate, newEndDate) {
        const newParams = new URLSearchParams(searchParams);
    
        if (newStartDate) {
          newParams.set("startDate", newStartDate.toISOString().split("T")[0]);
        } else {
          newParams.delete("startDate");
        }
    
        if (newEndDate) {
          newParams.set("endDate", newEndDate.toISOString().split("T")[0]);
        } else {
          newParams.delete("endDate");
        }
    
        setSearchParams(newParams);
        setStartDate(newStartDate);
        setEndDate(newEndDate);
      }

    const totalPages = Math.ceil(eventsData.eventCount / resultsPerPage);
    const page = Number(searchParams.get("page")) || 1;
    const sortState = searchParams.get("sort_by");
  
    if (page > totalPages && totalPages > 0) {
      navigate(`?page=${totalPages}`);
    }
  
    const firstResultIndex = (page - 1) * resultsPerPage + 1;
    const lastResultIndex =
      page * resultsPerPage < eventsData.eventCount ? page * resultsPerPage : eventsData.eventCount;
  
    useEffect(() => {
      if (sortState !== null) {
        setSortedBy(sortOptions[sortState]);
      }
    }, [sortState]);
  
    useEffect(() => {
      getEvents({ page, sort_by: sortedBy.sort_by, order: sortedBy.order, search, resultsPerPage, startDate, endDate }).then((data) => {
        setEventsData(data);
      });
    }, [sortedBy, page, search, startDate, endDate]);
  
    function handleSelect(event) {
      const index = event.target.value;
      const newParams = new URLSearchParams(searchParams);
      newParams.set("sort_by", index);
      newParams.set("page", 1);
      setSearchParams(newParams);
    }

  return (
    <>
      <div id="sort-and-result-count">
        <p id="result-count">
          showing results {firstResultIndex} - {lastResultIndex} of{" "}
          {eventsData.eventCount ? eventsData.eventCount : ""}
        </p>

        <select id="sort-selector" onChange={handleSelect}>
          {sortOptions.map((option, index) => {
            return (
              <option key={index} value={index}>
                {`${option.sortByText}: ${option.orderText}`}
              </option>
            );
          })}
        </select>
        <DateSelecter startDate={startDate} endDate={endDate} handleDateChange={handleDateChange} />
      </div>
      <div>
        <ul>
          {eventsData.events.map((event) => {
            return <EventCard key={event.event_id} event={event} />;
          })}
        </ul>
        <div id="page-selector">
        <PageSetter
          page={page}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          totalPages={totalPages}
        />
      </div>
      </div>
    </>
  );
}

export default Events;
