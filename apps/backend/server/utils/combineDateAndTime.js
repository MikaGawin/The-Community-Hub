function convertToTimestamp(dateString, timeString) {

  if (!dateString || !timeString) {
    throw new Error("Invalid date or time input");
  }
  const date = new Date(dateString);
  const time = new Date(timeString);

  const formattedDate = date.toISOString().split("T")[0]; // "2025-02-14"

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  const combinedDateTime = `${formattedDate} ${hours}:${minutes}:${seconds}`;

  return combinedDateTime;
}

module.exports = convertToTimestamp;