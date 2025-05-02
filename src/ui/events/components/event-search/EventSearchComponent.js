import {
  CITY_UPDATED,
  COMPONENT_NAME,
  DAYS_IN_WEEK,
  DEFAULT_SEARCH_PARAMETER,
  SEARCH_CITY_ID,
  SEARCH_COMPONENT_STATE,
} from "./Constants.js";

import { createComponentState } from "../../../../framework/state/ComponentStateManager.js";
import { setupEventHandlers } from "./EventSearchHandlers.js";
import { registerComponent } from "../../../../framework/EventHandlerFactory.js";

import { getCustomEventName } from "../../../../framework/EventHandlerFactory.js";
import { addLoadFunction } from "../../../../framework/state/LoadManager.js";
import {
  createRequestState,
  subscribeToRequestState,
  updateRequestState,
} from "../../../../framework/state/RequestStateManager.js";
import {
  EventSearchAPI,
  getSearchCities,
  getSearchResultGameLocations,
  SEARCH_REQUEST_STATE,
} from "../../data/search/EventSearchAPI.js";
import { eventSearchState } from "./EventSearchState.js";
import { subscribeToComponentState } from "../../../../framework/state/ComponentStateManager.js";
registerComponent(COMPONENT_NAME);

export class EventSearchComponent extends HTMLElement {
  constructor() {
    super();

    subscribeToComponentState(SEARCH_COMPONENT_STATE, this);

    addLoadFunction(SEARCH_REQUEST_STATE, function () {
      createRequestState(SEARCH_REQUEST_STATE);
      subscribeToRequestState(SEARCH_REQUEST_STATE, new EventSearchAPI());
      updateRequestState(SEARCH_REQUEST_STATE, function () {
        return {
          city: eventSearchState.location,
          day: eventSearchState.day,
        };
      });
      getSearchResultGameLocations();
      getSearchCities();
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

    //TODO: See if this can be deleted.
    document.addEventListener(
      getCustomEventName(COMPONENT_NAME, CITY_UPDATED),
      (e) => {
        console.log("Updating?");
        document.querySelector("#" + SEARCH_CITY_ID).innerHTML =
          this.getLocationSelect();
      },
    );
  }
}
if (!customElements.get("event-search-component")) {
  customElements.define("event-search-component", EventSearchComponent);
}
