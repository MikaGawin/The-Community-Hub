function extractDateTimeDuration(startDateStr, endDateStr) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (!(startDate instanceof Date) || isNaN(startDate)) {
    throw new Error("Invalid start date");
  }

  if (!(endDate instanceof Date) || isNaN(endDate)) {
    throw new Error("Invalid end date");
  }

  const formattedDate = startDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = startDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const durationMs = endDate - startDate;
  let roundedDuration = "";

  const durationMinutes = Math.ceil(durationMs / (1000 * 60));
  const roundedMinutes = Math.max(durationMinutes, 15);

  if (roundedMinutes < 60) {
    const roundedDurationMinutes = Math.ceil(roundedMinutes / 15) * 15;
    const roundedHours = Math.floor(roundedDurationMinutes / 60);
    const remainingMinutes = roundedDurationMinutes % 60;
    roundedDuration = `${
      roundedHours > 0 ? roundedHours + "h " : ""
    }${remainingMinutes}m`;
  } else if (durationMs < 1000 * 60 * 60 * 24) {
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));
    roundedDuration = `${durationHours}h`;
  } else {
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
    roundedDuration = `${durationDays} day${durationDays > 1 ? "s" : ""}`;
  }

  return { formattedDate, formattedTime, roundedDuration };
}

export default extractDateTimeDuration;
