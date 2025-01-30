import extractDateTimeDuration from "../../utils/dateConverter"

export default function EventCard({event}) {
    const times = extractDateTimeDuration(event.date, event.end_date)

    return (
        <>
            <h1>{event.title}</h1>
            <h2>{times.formattedDate}</h2>
            <h3>{times.formattedTime + " : " + times.roundedDuration}</h3>
            <p>{event.text}</p>
            <img src={event.pictures[0]? event.pictures[0] : null}></img>
        </>
    )
}