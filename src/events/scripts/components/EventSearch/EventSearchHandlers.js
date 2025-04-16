import { eventSearchState } from "../../data/state/EventSearchState.js";
import {
  CITY_UPDATED,
  COMPONENT_NAME,
  DEFAULT_SEARCH_PARAMETER,
  SEARCH_CITY_ID,
} from "./Constants.js";
import { dispatchCustomEvent } from "../EventHandlerFactory.js";
export function setupEventHandlers() {
  const searchForm = document.querySelector("form");
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchEvent = new CustomEvent("search", {
      detail: {
        city: eventSearchState.city,
        day: eventSearchState.day,
      },
    });
    document.dispatchEvent(searchEvent);
  });

  const select = document.querySelector("#" + SEARCH_CITY_ID);

  select.addEventListener("change", (e) => {
    eventSearchState.city = e.target.value;
  });

  const searchDays = document.querySelector("#search-days");

  searchDays.addEventListener("change", (e) => {
    eventSearchState.day = e.target.value;
  });
}

export function updateCities(cities) {
  const cityArray = Array.from(cities);
  cityArray.sort();
  cityArray.unshift(DEFAULT_SEARCH_PARAMETER);

  let id = 0;
  const cityData = [];
  cityArray.map((location) => {
    cityData.push({
      id: id,
      name: location,
    });
    id++;
  });

  eventSearchState.cities = cityData;
  dispatchCustomEvent(COMPONENT_NAME, CITY_UPDATED);
}
