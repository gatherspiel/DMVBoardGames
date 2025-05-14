import { eventSearchState } from "./EventSearchState.ts";
import { SEARCH_CITY_ID, SEARCH_DAYS_ID, SEARCH_FORM_ID } from "./Constants.ts";
import { SEARCH_REQUEST_STATE } from "./Constants.ts";
import { updateRequestState } from "../../../../framework/state/RequestStateManager.ts";
import {
  getElementWithId,
  getElementWithSelector,
} from "../../../../framework/components/utils/ComponentUtils.ts";

export function setupEventHandlers() {
  const searchForm = getElementWithSelector(`#${SEARCH_FORM_ID}`);
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    updateRequestState(SEARCH_REQUEST_STATE, function () {
      return {
        location: eventSearchState.location,
        day: eventSearchState.day,
      };
    });
  });

  const selectCity = getElementWithId(SEARCH_CITY_ID);

  selectCity.addEventListener("change", (e: Event) => {
    eventSearchState.location = (e.target as HTMLInputElement).value;
  });

  const searchDays = getElementWithId(SEARCH_DAYS_ID);

  searchDays.addEventListener("change", (e) => {
    eventSearchState.day = (e.target as HTMLInputElement).value;
  });
}
