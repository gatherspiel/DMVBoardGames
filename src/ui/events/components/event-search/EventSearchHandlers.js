import { eventSearchState } from "./EventSearchState.ts";
import { SEARCH_CITY_ID } from "./Constants.ts";
import { SEARCH_REQUEST_STATE } from "./Constants.ts";
import { updateRequestState } from "../../../../framework/state/RequestStateManager.ts";

export function setupEventHandlers() {
  const searchForm = document.querySelector("form");
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    updateRequestState(SEARCH_REQUEST_STATE, function () {
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
