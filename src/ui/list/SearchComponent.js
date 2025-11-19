import {
  DEFAULT_SEARCH_PARAMETER,
  generateCheckedStateFromUrlParamArray,
  getDaysOfWeekSelectHtml,
  getDaysOfWeekSelectedState,
  getDropdownHtml,
} from "../../shared/html/SelectGenerator.js";
import {
  generateButton,
  generateDisabledButton,
} from "../../shared/html/ButtonGenerator.js";
import { BaseDynamicComponent } from "@bponnaluri/places-js";
import { CITY_LIST_STORE } from "../../data/list/CityListStore.js";
import { SEARCH_RESULTS_LIST_STORE } from "../../data/list/SearchStores.js";

import { getDisplayName } from "../../shared/DisplayNameConversion.js";

const DEFAULT_PARAMETER_KEY = "defaultParameter";
const DEFAULT_PARAMETER_DISPLAY_KEY = "defaultParameterDisplay";
const ENABLE_SEARCH_TOGGLE_KEY = "enableSearchButton";
const SEARCH_BUTTON_ID = "search-button-id";
const SEARCH_DISTANCE_ID = "search-distance-id";
const SEARCH_CITY_ID = "search-cities";
const SEARCH_FORM_ID = "search-form";
const SHOW_DAY_SELECT = "show-day-select";

const DISTANCE_OPTIONS = [
  "0 miles",
  "5 miles",
  "10 miles",
  "15 miles",
  "30 miles",
  "50 miles",
];

export class SearchComponent extends BaseDynamicComponent {
  constructor() {
    super([
      {
        componentReducer: (cityArray) => {
          const copy = [];
          cityArray.forEach((city) => {
            copy.push(getDisplayName(city));
          });
          copy.sort();
          copy.unshift(DEFAULT_SEARCH_PARAMETER);
          const params = new URLSearchParams(document.location.search);
          const defaultSearchParams = {
            location: params.get("location"),
            days: generateCheckedStateFromUrlParamArray(params.get("days")),
            distance: params.get("distance")?.replaceAll("_", " "),
          };
          return {
            cityList: copy,
            [ENABLE_SEARCH_TOGGLE_KEY]: params.size === 0,
            ...defaultSearchParams,
          };
        },
        dataStore: CITY_LIST_STORE,
      },
    ]);

    const params = new URLSearchParams(document.location.search);

    const defaultSearchParams = {
      location: params.get("location"),
      apiUrl: this.getAttribute("api-url"),
      days: params.get("days"),
      distance: params.get("distance")?.replaceAll("_", " "),
    };
    if (params.size > 0) {
      SEARCH_RESULTS_LIST_STORE.fetchData(defaultSearchParams);
    }
  }

  getTemplateStyle() {
    return `
     <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
          select {
          width:10rem;
        }
        #days-of-week-select > :not(:first-child) {
          padding-left: 0.25rem;
        }  
        #search-form {
          display: flex;
          flex-wrap: wrap;
          padding-bottom:0.5rem;
          padding-left:1.5rem;
          padding-top:0.5rem;
        }   
        #search-form-inputs {
          padding-top:0.5rem; 
        } 
        .searchDropdownLabel {
          color: var(--clr-darker-blue);
          display: inline-block;
          font-weight:600;
        }
        @media not screen and (width < 32em) {
          select {
            margin-right: 0.5rem;
          }
          #group-search-header {
            padding-left:1.5rem;
          }
          #max-distance-label {
            margin-top:0.5rem;
            width: 8rem;
          }
          #search-form .form-item {
            display: inline-block;
          }
          #searchInputDiv {
            margin-top:0.5rem;
          }
        }     
        @media screen and (width < 32em) {
          #form-div-outer {
            width: 100%
          }
          #search-cities {
            margin-bottom: 0.5rem;
          }
          #search-distance-id {
          }
          .searchDropdownLabel {
            width: 11rem;
          }
          .search-form-two-inputs {
            display: inline-block;
            height:4rem;
          }
          .search-form-three-inputs {
            display: inline-block;
            height:7.5rem;
          }
        }
      </style>   
    `;
  }

  attachHandlersToShadowRoot(shadowRoot) {
    const self = this;
    shadowRoot.addEventListener("change", (event) => {
      const eventTarget = event.target;

      if (eventTarget.id === SEARCH_CITY_ID) {
        self.updateData({
          [ENABLE_SEARCH_TOGGLE_KEY]: true,
          location: eventTarget.value,
        });
      } else if (eventTarget.id === SEARCH_DISTANCE_ID) {
        self.updateData({
          [ENABLE_SEARCH_TOGGLE_KEY]: true,
          distance: eventTarget.value,
        });
      }
    });

    shadowRoot.addEventListener("click", (event) => {
      event.preventDefault();
      if (event.target.type === "checkbox") {
        const selectedDaysState = getDaysOfWeekSelectedState(shadowRoot);
        self.updateData({
          [ENABLE_SEARCH_TOGGLE_KEY]: true,
          days:
            Object.keys(selectedDaysState).length > 0
              ? selectedDaysState
              : null,
        });
      }
      if (event.target.id === SEARCH_BUTTON_ID) {
        const searchParams = {
          location: self.componentStore.location ?? "",
          days: self.componentStore.days
            ? Object.keys(self.componentStore.days).join(",")
            : "",
          distance: self.componentStore.distance,
        };

        self.updateData({
          [ENABLE_SEARCH_TOGGLE_KEY]: false,
        });

        const baseUrl = window.location.origin.split("?");
        let updatedUrl = `${baseUrl}?`;
        updatedUrl += `location=${searchParams.location.replaceAll(" ", "_")}&`;
        updatedUrl += `days=${searchParams.days.replaceAll(" ", "_")}&`;
        updatedUrl += `distance=${searchParams?.distance?.replaceAll(" ", "_") ?? ``}`;

        window.history.replaceState({}, "", updatedUrl);
        SEARCH_RESULTS_LIST_STORE.fetchData({
          ...searchParams,
          ...{ apiUrl: self.getAttribute("api-url") ?? "" },
        });
      }
      if (event.target.id === SHOW_DAY_SELECT) {
        self.updateData({
          showDaySelectOnMobile: !self.componentStore.showDaySelectOnMobile,
        });
      }
    });
  }

  render(store) {
    const searchInputsClass =
      store.location && store.location !== DEFAULT_SEARCH_PARAMETER
        ? "search-form-three-inputs"
        : "search-form-two-inputs";
    return `
      <h1 id="group-search-header">${this.getAttribute("search-text")}</h1>

      <form id=${SEARCH_FORM_ID} onsubmit="return false">
        <div id ="form-div-outer">
          <label class="searchDropdownLabel">Select event day: </label>

          ${
            store.showDaySelectOnMobile
              ? generateButton({
                  class: "show-mobile",
                  id: SHOW_DAY_SELECT,
                  text: "-",
                })
              : generateButton({
                  class: "show-mobile",
                  id: SHOW_DAY_SELECT,
                  text: "+",
                })
          }
          
          <div class="${store.showDaySelectOnMobile ? `` : `hide-mobile`}">
              ${getDaysOfWeekSelectHtml(store.days)}
            </div>
          <div id="search-form-inputs" class="${searchInputsClass}">

            <label class="searchDropdownLabel">Select event city: </label>
            ${getDropdownHtml({
              data: store.cityList ?? [{ name: "Any location" }],
              id: SEARCH_CITY_ID,
              name: "cities",
              selected: store.location,
              [DEFAULT_PARAMETER_KEY]: DEFAULT_SEARCH_PARAMETER,
              [DEFAULT_PARAMETER_DISPLAY_KEY]: "Any location",
            })}
            ${
              store.location && store.location !== DEFAULT_SEARCH_PARAMETER
                ? `
            <br>
            <label id="max-distance-label" class="searchDropdownLabel">Max distance:</label>

            ${getDropdownHtml({
              data: DISTANCE_OPTIONS,
              id: SEARCH_DISTANCE_ID,
              name: "distance",
              selected: store.distance ?? "5 miles",
              [DEFAULT_PARAMETER_KEY]: "5 miles",
              [DEFAULT_PARAMETER_DISPLAY_KEY]: "5 miles",
            })}`
                : ``
            }     
          </div>  
          <div id="searchInputDiv"> 
            ${
              store[ENABLE_SEARCH_TOGGLE_KEY]
                ? `${generateButton({
                    id: SEARCH_BUTTON_ID,
                    text: "Search",
                  })}`
                : `${generateDisabledButton({
                    id: "disabled-search-button",
                    text: "Search",
                  })}`
            }
          </div>
        </div>
      </form>
      
    `;
  }
}
