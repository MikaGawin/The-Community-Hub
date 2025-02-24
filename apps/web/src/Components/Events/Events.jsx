import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router";
import EventCard from "./EventCard";
import sortOptions from "../../utils/sortOptions";
import { getEvents } from "../../AxiosApi/axiosApi";
import PageSetter from "./PageSetter";
import React from "react";
import ConnectionFailed from "../ErrorFeedback/ConnectionFailed";
import { Grid, Box, Typography } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Events() {
  const { search } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const resultsPerPage = 24;
  const [eventsData, setEventsData] = useState({
    events: [],
    eventCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [connectSuccess, setConnectSuccess] = useState(true);

  const allSortOptions = search
    ? [
        {
          sortByText: "Relevance",
          orderText: "",
          order: "asc",
          sort_by: "search_priority",
        },
        ...sortOptions,
      ]
    : sortOptions;

  const [sortedBy, setSortedBy] = useState(()=>{
    const sortIndex = searchParams.get("sort_by")? searchParams.get("sort_by") : 0
    return allSortOptions[sortIndex];
  })

  useEffect(()=> {
    setSortedBy(allSortOptions[0])
  }, [search])

  const [startDate, setStartDate] = useState(
    searchParams.get("startDate")
      ? new Date(searchParams.get("startDate"))
      : null
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

  const totalPages = eventsData.eventCount
    ? Math.ceil(eventsData.eventCount / resultsPerPage)
    : 0;
  const page = Number(searchParams.get("page")) || 1;
  const sortState = searchParams.get("sort_by");

  if (page > totalPages && totalPages > 0) {
    navigate(`?page=${totalPages}`);
  }

  const firstResultIndex = (page - 1) * resultsPerPage + 1;
  const lastResultIndex =
    page * resultsPerPage < eventsData.eventCount
      ? page * resultsPerPage
      : eventsData.eventCount;

  useEffect(() => {
    if (sortState !== null) {
      setSortedBy(allSortOptions[sortState]);
    }
  }, [sortState]);

  useEffect(() => {
    setIsLoading(true);
    getEvents({
      page,
      sort_by: sortedBy.sort_by,
      sortOrder: sortedBy.order,
      search,
      resultsPerPage,
      startDate,
      endDate,
    }).then((data) => {
      if (data === "failed to connect to server") {
        setConnectSuccess(false);
      } else {
        setEventsData(data);
      }
      setIsLoading(false);
    });
  }, [sortedBy, page, search, startDate, endDate]);
  
  function handleSelectSort(event) {
    const index = event.target.selectedIndex;
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort_by", index);
    newParams.set("page", 1);
    setSearchParams(newParams);
    setSortedBy(allSortOptions[index]);
  }
  
  
  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <input value={value} onClick={onClick} readOnly className="date-picker" />
  ));
  
  if (!connectSuccess) {
    console.log(connectSuccess)
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
        <Box sx={{ width: "200px", flexShrink: 0 }}>
          <Typography variant="body2" fontWeight="bold">
            Sort By:
          </Typography>
          <select
            id="sort-selector"
            aria-label="Sort options"
            onChange={handleSelectSort}
            value={`${sortedBy.sortByText}: ${sortedBy.orderText}`}
            style={{
              minWidth: "200px",
            }}
          >
            {allSortOptions.map((option, index) => (
              <option
                key={index}
                value={`${option.sortByText}: ${option.orderText}`}
              >
                {option.sortByText}: {option.orderText}
              </option>
            ))}
          </select>
        </Box>

        <Box sx={{ width: "200px", flexShrink: 0 }}>
          <Typography variant="body2" fontWeight="bold">
            Start Date:
          </Typography>
          <DatePicker
            customInput={<CustomInput />}
            selected={startDate}
            onChange={(date) => handleDateChange(date, endDate)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Select a start date"
            dateFormat="yyyy-MM-dd"
            className="date-picker"
          />
        </Box>

        <Box sx={{ width: "200px", flexShrink: 0 }}>
          <Typography variant="body2" fontWeight="bold">
            End Date:
          </Typography>
          <DatePicker
            customInput={<CustomInput />}
            selected={endDate}
            onChange={(date) => handleDateChange(startDate, date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="Select an end date"
            dateFormat="yyyy-MM-dd"
            className="date-picker"
          />
        </Box>
      </Box>

      <Box p={2}>
        <Typography
          variant="body1"
          sx={{ flex: "1 1 auto", minWidth: "250px" }}
        >
          {isLoading
            ? "Finding events..."
            : `Showing results ${
                search ? `for ${search}` : ""
              } ${firstResultIndex} - ${lastResultIndex} of ${
                eventsData.eventCount
              }`}
        </Typography>

        <Grid container spacing={3} justifyContent="flex-start">
          {eventsData.events.map((event) => (
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
          ))}
        </Grid>

        <Box mt={3} display="flex" justifyContent="center">
          <PageSetter
            page={page}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            totalPages={totalPages}
          />
        </Box>
      </Box>
    </>
  );
}

export default Events;
