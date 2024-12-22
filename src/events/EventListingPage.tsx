import { fetchEventDataAtom } from "../state/EventState.ts";
import { useAtom } from "jotai";

export function EventListingPage() {
  const [data, setData] = useAtom(fetchEventDataAtom);
  console.log(data + ":" + setData);
  return (
    <div>
      <h1>Groups With Recurring events</h1>
      {data.groups.map((group, index) => (
        <div key={index}>
          <h2>
            <a href={group.link}>{group.title}</a>
          </h2>
          <p>{group.summary}</p>
          <h3>
            {group.events.length === 0
              ? "Click on group link above for event information"
              : ""}
          </h3>
          <div>
            {group.events.map((event, index) => (
              <div key={index}>
                <h4>{event.title}</h4>
                <p>Summary: {event.summary}</p>
                <p>Day: {event.day}</p>
                <p>Location: {event.location}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      <h1> Upcoming conventions</h1>
      {data.conventions.map((convention, index) => (
        <div key={index}>
          <h3>
            <a href={convention.link}>{convention.title}</a>
          </h3>
          <p>Days: {convention.days.join()}</p>
        </div>
      ))}
      <h1> Game stores </h1>
      {data.gameStores.map((gameStore, index) => (
        <div key={index}>
          <h3>
            {gameStore.link && gameStore.link !== "" ? (
              <a href={gameStore.link}>{gameStore.name}</a>
            ) : (
              <p>{gameStore.name}</p>
            )}
          </h3>
          <p>Location: {gameStore.location}</p>
        </div>
      ))}
    </div>
  );
}
