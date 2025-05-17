import {
  DAYS_IN_WEEK,
  DEFAULT_SEARCH_PARAMETER,
  SEARCH_CITY_ID,
  SEARCH_COMPONENT_LOADED_STATE,
  SEARCH_COMPONENT_LOADED_STATE_CITIES,
  SEARCH_COMPONENT_STATE,
  SEARCH_FORM_ID,
  SEARCH_REQUEST_STATE,
} from "./Constants.ts";

import { eventSearchState } from "./EventSearchState.ts";
import { createRequestState } from "../../../../framework/state/RequestStateManager.ts";
import { EVENT_SEARCH_API } from "../../data/search/EventAPI.ts";
import { LOCATION_API } from "../../data/search/LocationsAPI.ts";
import { CITIES_API } from "../../data/search/CityListAPI.ts";
import type { EventSearchCity } from "./types/EventSearchCity.ts";
import {
  SEARCH_EVENT_HANDLER_CONFIG,
  UPDATE_CITY_CONFIG,
  UPDATE_DAY_CONFIG,
} from "./EventSearchHandlers.ts";
import { BaseDynamicComponent } from "../../../../framework/components/BaseDynamicComponent.ts";

const loadConfig = {
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
};

export class EventSearchComponent extends BaseDynamicComponent {
  constructor() {
    super(
      [SEARCH_EVENT_HANDLER_CONFIG, UPDATE_CITY_CONFIG, UPDATE_DAY_CONFIG],
      SEARCH_COMPONENT_STATE,
      loadConfig,
    );
  }

  generateHTML(eventSearchState: any) {
    return `
      <form id=${SEARCH_FORM_ID}>

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
                  `<option key=${index} value=${day} ${day === eventSearchState.day ? "selected" : ""}>
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

  getCityHtml(eventSearchState: any) {
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

  getLocationSelect(eventSearchState: any) {
    const data = `
    ${eventSearchState.cities?.map(
      (location: EventSearchCity) =>
        `<option key=${location.index} value="${location.name}" ${location.name === eventSearchState.location ? "selected" : ""}>
          ${
            location.name === DEFAULT_SEARCH_PARAMETER
              ? "Any location"
              : location.name
          }
        </option>`,
    )}`;
    return data;
  }
}
if (!customElements.get("event-search-component")) {
  customElements.define("event-search-component", EventSearchComponent);
}
