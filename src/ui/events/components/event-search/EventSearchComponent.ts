import {
  DAYS_IN_WEEK,
  DEFAULT_SEARCH_PARAMETER,
  SEARCH_CITY_ID,
  SEARCH_FORM_ID,
  SEARCH_REQUEST_STORE,
} from "./Constants.ts";

import { createRequestStoreWithData } from "../../../../framework/store/RequestStore.ts";
import { EVENT_LIST_REDUCER } from "../../data/search/EventListReducer.ts";
import { LOCATIONS_REDUCER } from "../../data/search/LocationsReducer.ts";
import {
  CITY_LIST_REDUCER,
  updateCities,
} from "../../data/search/CityListReducer.ts";
import type { EventSearchCity } from "./types/EventSearchCity.ts";
import {
  SEARCH_EVENT_HANDLER_CONFIG,
  UPDATE_CITY_CONFIG,
  UPDATE_DAY_CONFIG,
} from "./EventSearchHandlers.ts";
import { BaseDynamicComponent } from "../../../../framework/components/BaseDynamicComponent.ts";

const loadConfig = {
  onLoadStoreConfig: {
    storeName: SEARCH_REQUEST_STORE,
    dataSource: EVENT_LIST_REDUCER,
  },
  requestData: {
    city: DEFAULT_SEARCH_PARAMETER,
    day: DEFAULT_SEARCH_PARAMETER,
  },
  dependencyUpdates: function () {
    createRequestStoreWithData("search-component-loaded", LOCATIONS_REDUCER);
    createRequestStoreWithData(
      "search-component-loaded-cities",
      CITY_LIST_REDUCER,
    );
  },
};

export class EventSearchComponent extends BaseDynamicComponent {
  constructor() {
    super("event-search-component-store", loadConfig);
    this.subscribeToReducer(CITY_LIST_REDUCER, updateCities);
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
