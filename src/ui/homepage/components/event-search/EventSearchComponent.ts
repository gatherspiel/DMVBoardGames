import {
  DAYS_IN_WEEK,
  DEFAULT_SEARCH_PARAMETER,
  SEARCH_CITY_ID,
  SEARCH_FORM_ID
} from "./Constants.ts";

import { EVENT_SEARCH_THUNK } from "../../data/search/EventSearchThunk.ts";
import {
  CITY_LIST_THUNK,
  updateCities,
} from "../../data/search/CityListThunk.ts";
import type { EventSearchCity } from "./types/EventSearchCity.ts";
import {
  SEARCH_EVENT_HANDLER_CONFIG,
  UPDATE_CITY_CONFIG,
  UPDATE_DAY_CONFIG,
} from "./EventSearchHandlers.ts";
import { BaseTemplateDynamicComponent } from "../../../../framework/components/BaseTemplateDynamicComponent.ts";
import {LOCATIONS_THUNK} from "../../data/search/LocationsThunk.ts";

const loadConfig = {
  onLoadStoreConfig: {
    dataSource: EVENT_SEARCH_THUNK,
  },
  onLoadRequestData: {
    city: DEFAULT_SEARCH_PARAMETER,
    day: DEFAULT_SEARCH_PARAMETER,
  },
  onLoadRequestConfig: [
    {
      dataSource: LOCATIONS_THUNK,
    },
    {
      dataSource: CITY_LIST_THUNK,
    },
  ],
  thunkReducers: [
    {
      thunk: EVENT_SEARCH_THUNK,
      componentStoreReducer: function(data: any){
        return data;
      }
    },
    {
      thunk: CITY_LIST_THUNK,
      componentStoreReducer: updateCities,
    },
  ],
};

const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>

  <style>
  #event-search {
    border-top: 1px solid var(--clr-lighter-blue);
    padding-block: 1.5rem;
  }
  
  #search-form {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 4rem;
    justify-content: left;
    padding-bottom: 5px;
  }
  
  #search-form label {
    margin-right: 0.5rem;
  }
  
  #search-form select {
    border-color: var(--clr-light-blue);
    border-radius: 5px;
    color: var(--clr-light-blue);
    cursor: pointer;
    margin-right: 1.25rem;
    padding: 0.25rem;
  }
  
  not  @media screen and (width < 32em) {
    display: flex;
    flex-wrap: wrap;
  }
  
  @media screen and (width < 32em) {
    #search-form {
      gap: 2rem;
    }
    
    .search-input-wrapper {
      align-items: center;
      justify-content: center;
    }
    
    button {
      justify-content: center;
    }
    
    #searchButtonWrapper {
    }
  }
</style>

`;
export class EventSearchComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super("event-search-component-store", loadConfig);
  }

  override getTemplateStyle(): string {
    return template;
  }
  render(eventSearchStore: any) {
    return `

      <div class="ui-section">
        <form id=${SEARCH_FORM_ID} ${this.createSubmitEvent(SEARCH_EVENT_HANDLER_CONFIG)}>
          <div id='search-input-wrapper'>
            <div>
              ${this.getCityHtml(eventSearchStore)}
            </div>
            <div >
              <label htmlFor="days">Select event day:</label>
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
            <div>
              <button type="submit" >Search Groups</button>
            </div>
          </div>
        </form>
      </div>
  `;
  }

  getCityHtml(eventSearchStore: any) {
    return ` 
    <label>Select event city: </label>
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
