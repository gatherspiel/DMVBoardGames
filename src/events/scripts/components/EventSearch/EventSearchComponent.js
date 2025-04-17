import {
  CITY_UPDATED,
  COMPONENT_NAME,
  DAYS_IN_WEEK,
  DEFAULT_SEARCH_PARAMETER,
  SEARCH_CITY_ID,
} from "./Constants.js";

import { setupEventHandlers } from "./EventSearchHandlers.js";
import {
  getCustomEventName,
  registerComponent,
} from "../../../../framework/EventHandlerFactory.js";
import { Component } from "../../../../framework/Component/Component.js";

registerComponent(COMPONENT_NAME);

export class EventSearchComponent extends Component {
  createEventHandlers() {
    setupEventHandlers();
    document.addEventListener(
      getCustomEventName(COMPONENT_NAME, CITY_UPDATED),
      (e) => {
        document.querySelector("#" + SEARCH_CITY_ID).innerHTML =
          getLocationSelect();
      },
    );
  }

  generateHtml(eventSearchState) {
    return `
      <form id='search-form'>

        <div id='search-input-wrapper'>
          <div>
            ${getCityHtml(eventSearchState)}
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
}

function getLocationSelect(eventSearchState) {
  const data = `
    ${eventSearchState.cities.map(
      (location) =>
        `<option key=${location.index} value=${location.name}>
          ${
            location.name === DEFAULT_SEARCH_PARAMETER
              ? "Any location"
              : location.name
          }
        </option>`,
    )}`;
  return data;
}

function getCityHtml(eventSearchState) {
  return ` 
    <label>Select city: </label>
    <select
      id=${SEARCH_CITY_ID}
      name="cities"
      value=${eventSearchState.cities}
    >

    ${getLocationSelect(eventSearchState)}
    </select>`;
}
