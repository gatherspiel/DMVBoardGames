// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState } from "react";

import { useSetAtom } from "jotai";
import { readWriteSearchState } from "../state/EventState.ts";
export function EventSearch() {
  const [day, setDay] = useState("Any");

  const setSearchState = useSetAtom(readWriteSearchState);
  const days = [
    "Any",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  function handleSubmit(e: Event) {
    e.preventDefault();

    console.log("Setting search state to:" + day);
    setSearchState({
      day: day,
    });
  }
  return (
    <div>
      <h2>Search</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="days">Chose a day:</label>
        <select
          name="days"
          id="days"
          value={day}
          onChange={(e) => setDay(e.target.value)}
        >
          {days.map((day, index) => (
            <option key={index} value={day}>
              {day}
            </option>
          ))}
        </select>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
