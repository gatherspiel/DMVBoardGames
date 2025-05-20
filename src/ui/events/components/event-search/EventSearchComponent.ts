import {
  DAYS_IN_WEEK,
  DEFAULT_SEARCH_PARAMETER,
  SEARCH_CITY_ID,
  SEARCH_COMPONENT_LOADED_STORE,
  SEARCH_COMPONENT_LOADED_STORE_CITIES,
  SEARCH_COMPONENT_STORE,
  SEARCH_FORM_ID,
  SEARCH_REQUEST_STORE,
} from "./Constants.ts";

import { createRequestStore } from "../../../../framework/store/RequestStore.ts";
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
  storeName: SEARCH_REQUEST_STORE,
  dataSource: EVENT_SEARCH_API,
  requestData: {
    city: DEFAULT_SEARCH_PARAMETER,
    day: DEFAULT_SEARCH_PARAMETER,
  },
  dependencyUpdates: function () {
    createRequestStore(SEARCH_COMPONENT_LOADED_STORE, LOCATION_API);
    createRequestStore(SEARCH_COMPONENT_LOADED_STORE_CITIES, CITIES_API);
  },
};

export class EventSearchComponent extends BaseDynamicComponent {
  constructor() {
    super(SEARCH_COMPONENT_STORE, loadConfig);
  }

  render(eventSearchStore: any) {
    return `
      <form id=${SEARCH_FORM_ID} ${this.createSubmitEvent(SEARCH_EVENT_HANDLER_CONFIG)}>

        <div id='search-input-wrapper'>
          <div>
            ${this.getCityHtml(eventSearchStore)}
          </div>
          <div>
            <label htmlFor="days">Select day:</label>
            <select
              name="days"
              id="search-days"
              value=${eventSearchStore.day}
              ${this.createOnChangeEvent(UPDATE_DAY_CONFIG)}
            >
              ${DAYS_IN_WEEK.map(
                (day, index) =>
                  `<option key=${index} value=${day} ${day === eventSearchStore.day ? "selected" : ""}>
                    ${day === DEFAULT_SEARCH_PARAMETER ? "Any day" : day}
                   </option>`,
              )}
            </select>
          </div>

        </div>
        <button type="submit" >SEARCH EVENTS</button>
      </form>
  `;
  }

  getCityHtml(eventSearchStore: any) {
    return ` 
    <label>Select city: </label>
    <select
      id=${SEARCH_CITY_ID}
      name="cities"
      value=${eventSearchStore.cities}
      ${this.createOnChangeEvent(UPDATE_CITY_CONFIG)}
    >

    ${this.getLocationSelect(eventSearchStore)}
    </select>`;
  }

  getLocationSelect(eventSearchStore: any) {
    const data = `
    ${eventSearchStore.cities?.map(
      (location: EventSearchCity) =>
        `<option key=${location.index} value="${location.name}" ${location.name === eventSearchStore.location ? "selected" : ""}>
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
