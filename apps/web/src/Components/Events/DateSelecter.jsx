import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DateSelecter({ startDate, endDate, handleDateChange }) {
  return (
    <div>
      <p>Select start date:</p>
      <DatePicker
        selected={startDate}
        onChange={(date) => handleDateChange(date, endDate)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        placeholderText="Select a start date"
      />

      <p>Select end date:</p>
      <DatePicker
        selected={endDate}
        onChange={(date) => handleDateChange(startDate, date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        placeholderText="Select an end date"
      />
    </div>
  );
}
