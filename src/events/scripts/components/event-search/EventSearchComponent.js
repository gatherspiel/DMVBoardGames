import {
  CITY_UPDATED,
  COMPONENT_NAME,
  DAYS_IN_WEEK,
  DEFAULT_SEARCH_PARAMETER,
  SEARCH_CITY_ID,
  SEARCH_COMPONENT_STATE,
} from "./Constants.js";

import { setupEventHandlers } from "./EventSearchHandlers.js";
import { registerComponent } from "../../../../framework/EventHandlerFactory.js";
import {
  getState,
  subscribeToState,
} from "../../../../framework/state/StateManager.js";
import { getCustomEventName } from "../../../../framework/EventHandlerFactory.js";

registerComponent(COMPONENT_NAME);

export class EventSearchComponent extends HTMLElement {
  constructor() {
    super();
    subscribeToState(SEARCH_COMPONENT_STATE, this);
  }

  connectedCallback() {
    this.innerHTML = this.generateHtml(getState(SEARCH_COMPONENT_STATE));
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
