import { updateState } from "../../framework/state/StateManager.js";
import {
  getSearchResultGameLocations,
  SEARCH_REQUEST_STATE,
} from "./data/search/EventSearchAPI.js";
import { eventSearchState } from "./components/event-search/EventSearchState.js";
import { getSearchCities } from "./data/search/EventSearchAPI.js";
import { setLoadFunction } from "../../framework/state/DataInit.js";

const loadFunction = (event) => {
  updateState(SEARCH_REQUEST_STATE, function () {
    return {
      city: eventSearchState.city,
      day: eventSearchState.day,
    };
  });

  getSearchResultGameLocations();
  getSearchCities();
};

setLoadFunction(loadFunction);
