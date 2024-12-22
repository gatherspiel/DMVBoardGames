import { useState } from "react";
import { Group } from "../data/ObjectConfig.ts";

export function GroupInfo({ group }: { group: Group }) {
  const [showInfo, setShowInfo] = useState(false);

  const updateShowInfo = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(event);
    setShowInfo(!showInfo);
  };
  const index = group.id;
  return (
    <div key={index}>
      <h2>
        <a href={group.link}>{group.title}</a>
      </h2>
      <button onClick={updateShowInfo}>
        {showInfo ? "Hide info" : "Show info"}
      </button>

      {showInfo && (
        <div>
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
      )}
    </div>
  );
}
