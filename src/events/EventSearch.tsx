// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState } from "react";

import {useAtom, useSetAtom} from "jotai";
import {readWriteSearchState, searchLocationsAtom} from "../state/EventState.ts";
import {DEFAULT_SEARCH_PARAMETER} from "../data/search/search.ts";
export function EventSearch() {
  const [day, setDay] = useState(DEFAULT_SEARCH_PARAMETER);
  const [location, setLocation] = useState(DEFAULT_SEARCH_PARAMETER);

  const setSearchState = useSetAtom(readWriteSearchState);

  const [locations] = useAtom(searchLocationsAtom);
  const days = [
    DEFAULT_SEARCH_PARAMETER,
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
    setSearchState({
      day: day,
      location: location
    });
  }
  return (
    <div>
      <h1>Search</h1>

      <form onSubmit={handleSubmit}>

        <label htmlFor="locations">Chose a location: </label>
        <select
          id="locations"
          name="locations"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          {locations.map((day, index) => (
            <option key={index} value={day}>
              {day}
            </option>
          ))}
        </select>
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
