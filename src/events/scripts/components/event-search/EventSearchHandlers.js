import { eventSearchState } from "./EventSearchState.js";
import { SEARCH_CITY_ID } from "./Constants.js";
import {
  createState,
  subscribeToState,
  updateState,
} from "../../../../framework/state/StateManager.js";
import { SEARCH_REQUEST_STATE } from "../../data/search/EventSearchAPI.js";
import { EventSearchAPI } from "../../data/search/EventSearchAPI.js";

createState(SEARCH_REQUEST_STATE);
subscribeToState(SEARCH_REQUEST_STATE, new EventSearchAPI());

export function setupEventHandlers() {
  const searchForm = document.querySelector("form");
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    updateState(SEARCH_REQUEST_STATE, function () {
      return {
        city: eventSearchState.city,
        day: eventSearchState.day,
      };
    });
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
