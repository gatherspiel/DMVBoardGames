import { eventSearchState } from "../data/state/EventSearchState.js";

const DEFAULT_SEARCH_PARAMETER = "any";

const DAYS_IN_WEEK = [
  DEFAULT_SEARCH_PARAMETER,
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function updateCities(cities) {
  const cityArray = Array.from(cities);
  cityArray.sort();
  cityArray.unshift(DEFAULT_SEARCH_PARAMETER);

  let id = 0;
  const cityData = [];
  cityArray.map((location) => {
    cityData.push({
      id: id,
      name: location,
    });
    id++;
  });

  eventSearchState.cities = cityData;
  refreshLocations();
}

function refreshLocations() {
  document.querySelector("#search-locations").innerHTML = getLocationSelect();
}

function setupEventHandlers() {
  const searchForm = document.querySelector("form");
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchEvent = new CustomEvent("search", {
      detail: {
        city: eventSearchState.city,
        day: eventSearchState.day,
      },
    });
    document.dispatchEvent(searchEvent);
  });

  const select = document.querySelector("#search-locations");

  select.addEventListener("change", (e) => {
    eventSearchState.city = e.target.value;
  });

  const searchDays = document.querySelector("#search-days");

  searchDays.addEventListener("change", (e) => {
    eventSearchState.day = e.target.value;
  });
}

function getLocationSelect() {
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
function getLocationHtml() {
  return ` 
    <label>Select location: </label>
    <select
      id="search-locations"
      name="locations"
      value=${eventSearchState.cities}
    >

    ${getLocationSelect()}
    </select>`;
}

function init() {
  const html = `
      <form id='search-form'>

        <div id='search-input-wrapper'>
          <div>
            ${getLocationHtml(eventSearchState.cities)}
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
  document.querySelector("#event-search").innerHTML = html;
}

init();
setupEventHandlers();
