import {
  DAYS_IN_WEEK,
  DEFAULT_SEARCH_PARAMETER,
  SEARCH_CITY_ID,
  SEARCH_COMPONENT_LOADED_STATE,
  SEARCH_COMPONENT_LOADED_STATE_CITIES,
  SEARCH_COMPONENT_STATE,
  SEARCH_REQUEST_STATE,
} from "./Constants.ts";

import { setupEventHandlers } from "./EventSearchHandlers.js";
import { subscribeToComponentState } from "../../../../framework/state/ComponentStateManager.ts";
import { eventSearchState } from "./EventSearchState.ts";
import {
  createRequestState,
  initStateOnLoad,
} from "../../../../framework/state/RequestStateManager.ts";
import { EVENT_SEARCH_API } from "../../data/search/EventAPI.ts";
import { LOCATION_API } from "../../data/search/LocationsAPI.ts";
import { CITIES_API } from "../../data/search/CityListAPI.ts";
export class EventSearchComponent extends HTMLElement {
  constructor() {
    super();

    subscribeToComponentState(SEARCH_COMPONENT_STATE, this);

    initStateOnLoad({
      stateName: SEARCH_REQUEST_STATE,
      dataSource: EVENT_SEARCH_API,
      requestData: {
        city: eventSearchState.location,
        day: eventSearchState.day,
      },
      dependencyUpdates: function () {
        createRequestState(SEARCH_COMPONENT_LOADED_STATE, LOCATION_API);
        createRequestState(SEARCH_COMPONENT_LOADED_STATE_CITIES, CITIES_API);
      },
    });
  }

  generateHtml(eventSearchState) {
    return `
      <form id='search-form'>

        <div id='search-input-wrapper'>
          <div>
            ${this.getCityHtml(eventSearchState)}
          </div>
          <div>
            <label htmlFor="days">Select day:</label>
            <select
              name="days"
              id="search-days"
              value=${eventSearchState.day}
            >
              ${DAYS_IN_WEEK.map(
                (day, index) =>
                  `<option key=${index} value=${day}>
                    ${day === DEFAULT_SEARCH_PARAMETER ? "Any day" : day}
                   </option>`,
              )}
            </select>
          </div>

        </div>
        <button type="submit">SEARCH EVENTS</button>
      </form>
  `;
  }

  getCityHtml(eventSearchState) {
    return ` 
    <label>Select city: </label>
    <select
      id=${SEARCH_CITY_ID}
      name="cities"
      value=${eventSearchState.cities}
    >

    ${this.getLocationSelect(eventSearchState)}
    </select>`;
  }

  getLocationSelect(eventSearchState) {
    const data = `
    ${eventSearchState.cities?.map(
      (location) =>
        `<option key=${location.index} value="${location.name}">
          ${
            location.name === DEFAULT_SEARCH_PARAMETER
              ? "Any location"
              : location.name
          }
        </option>`,
    )}`;
    return data;
  }

  updateData(state) {
    this.innerHTML = this.generateHtml(state);
    setupEventHandlers();
  }
}
if (!customElements.get("event-search-component")) {
  customElements.define("event-search-component", EventSearchComponent);
}
