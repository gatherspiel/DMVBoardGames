import { updateState } from "../../framework/State/StateManager.js";
import {
  getSearchResultGameLocations,
  SEARCH_REQUEST_STATE,
} from "./data/search/EventSearchAPI.js";
import { eventSearchState } from "./components/EventSearch/EventSearchState.js";
import { getSearchCities } from "./data/search/EventSearchAPI.js";

window.onload = (event) => {
  updateState(SEARCH_REQUEST_STATE, function () {
    return {
      city: eventSearchState.city,
      day: eventSearchState.day,
    };
  });

  getSearchResultGameLocations();
  getSearchCities();
};
