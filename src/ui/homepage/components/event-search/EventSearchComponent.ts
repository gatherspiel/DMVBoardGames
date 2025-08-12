import {
  DAYS_IN_WEEK,
  DEFAULT_SEARCH_PARAMETER, DISTANCE_OPTIONS, SEARCH_CITY_ID,
  SEARCH_FORM_ID
} from "./Constants.ts";

import {EVENT_PRELOAD_THUNK} from "../../data/search/EventSearchThunk.ts";
import {
  CITY_LIST_THUNK,
  updateCities,
} from "../../data/search/CityListThunk.ts";
import {
  SEARCH_EVENT_HANDLER_CONFIG, UPDATE_CITY_CONFIG, UPDATE_DAY_CONFIG, UPDATE_DISTANCE_CONFIG,
} from "./EventSearchHandlers.ts";
import { BaseTemplateDynamicComponent } from "../../../../framework/components/BaseTemplateDynamicComponent.ts";
import {LOCATIONS_THUNK} from "../../data/search/LocationsThunk.ts";
import {generateButton} from "../../../../shared/components/ButtonGenerator.ts";
import type {DropdownConfig} from "../../../../framework/components/types/DropdownConfig.ts";
import {getDisplayName} from "../../../../shared/DisplayNameConversion.ts";
import {
  ON_LOAD_REQUEST_CONFIG_KEY,
  ON_LOAD_REQUEST_DATA_KEY,
  ON_LOAD_STORE_CONFIG_KEY, REQUEST_THUNK_REDUCERS_KEY
} from "../../../../framework/components/types/ComponentLoadConfig.ts";
import {
  DEFAULT_PARAMETER_DISPLAY_KEY,
  DEFAULT_PARAMETER_KEY,
  EVENT_HANDLER_CONFIG_KEY
} from "../../../../shared/Constants.ts";
import {initRequestStore} from "../../../../framework/state/data/RequestStore.ts";
const loadConfig = {
  [ON_LOAD_STORE_CONFIG_KEY]: {
    dataSource: EVENT_PRELOAD_THUNK,
  },
  [ON_LOAD_REQUEST_DATA_KEY]: {
    city: DEFAULT_SEARCH_PARAMETER,
    day: DEFAULT_SEARCH_PARAMETER,
  },
  [ON_LOAD_REQUEST_CONFIG_KEY]: [
    {
      dataSource: LOCATIONS_THUNK,
    },
    {
      dataSource: CITY_LIST_THUNK,
    },
  ],
  [REQUEST_THUNK_REDUCERS_KEY]: [
    {
      thunk: EVENT_PRELOAD_THUNK,
      componentReducer: (data: any)=> data
    },
    {
      thunk: CITY_LIST_THUNK,
      componentReducer: updateCities,
    }
  ],
};

const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>

  <style>
  
  #event-search {
    border-top: 1px solid var(--clr-lighter-blue);
  }
  
  .search-button {
    margin-top:2rem;
  }
  #search-form {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 4rem;
    justify-content: left;
    padding-bottom: 5px;
  }
  
  #search-form select {
    border-color: var(--clr-light-blue);
    border-radius: 5px;
    color: var(--clr-light-blue);
    cursor: pointer;
    padding: 0.25rem;
  }
  
  select {
    width:10rem;
  }
  
  .searchDropdownLabel {
    display: inline-block;
    width: 13rem;
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
  }
</style>
`;

export class EventSearchComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super("event-search-component-store", loadConfig);
    console.log("Hi")
  }

  override getTemplateStyle(): string {
    return template;
  }

  connectedCallback(){
    initRequestStore(loadConfig);
  }

  render(eventSearchStore: any) {

    if(!this.getAttribute("isVisible") || this.getAttribute("isVisible")=== "false"){
      return ''
    }
    return `
   
      <div id="event-search" class="ui-section">
        <form id=${SEARCH_FORM_ID}>
          <div id='search-input-wrapper'>
             <div>
              ${this.getDropdownHtml({
              label:"Select event day:",
              id: 'search-days',
              name: "days",
              data: DAYS_IN_WEEK,
              selected: eventSearchStore.day,
              [DEFAULT_PARAMETER_KEY]:DEFAULT_SEARCH_PARAMETER,
              [DEFAULT_PARAMETER_DISPLAY_KEY]: "Any day",
              [EVENT_HANDLER_CONFIG_KEY]: UPDATE_DAY_CONFIG
            })}
            </div>
            <div>
              ${this.getDropdownHtml({
                label:"Select event city:",
                id: SEARCH_CITY_ID,
                name: "cities",
                data: eventSearchStore.cities ?? [{name:"Any location"}],
                selected: eventSearchStore.location,
                [DEFAULT_PARAMETER_KEY]:DEFAULT_SEARCH_PARAMETER,
                [DEFAULT_PARAMETER_DISPLAY_KEY]: "Any location",
                [EVENT_HANDLER_CONFIG_KEY]: UPDATE_CITY_CONFIG
              })}
            </div>
            ${eventSearchStore.location ?
              `<div>
              ${this.getDropdownHtml({
                label:"Select distance:",
                id: "search-distance",
                name: "distance",
                data: DISTANCE_OPTIONS,
                selected: eventSearchStore.distance,
                [DEFAULT_PARAMETER_KEY]:"0 miles",
                [DEFAULT_PARAMETER_DISPLAY_KEY]: "0 miles",
                [EVENT_HANDLER_CONFIG_KEY]: UPDATE_DISTANCE_CONFIG
                
              })}</div>` :
               ``}
            
            <div> 
              ${generateButton({
                text: "Search groups",
                class: "search-button",
                component: this,
                [EVENT_HANDLER_CONFIG_KEY]: SEARCH_EVENT_HANDLER_CONFIG,
              })}
            </div>
          </div>
        </form>
      </div>
  `;

  }

  getDropdownHtml(dropdownConfig: DropdownConfig) {
    return ` 
    <label class="searchDropdownLabel">${dropdownConfig.label} </label>
    <select
      id=${dropdownConfig.id}
      name=${dropdownConfig.name}
      value=${dropdownConfig.data}
      ${this.addOnChangeEvent(dropdownConfig[EVENT_HANDLER_CONFIG_KEY])}
    >
    ${dropdownConfig.data?.map(
      (item: any) =>
        `<option key=${item.index} value="${item.name}" ${item.name === dropdownConfig.selected ? "selected" : ""}>
          ${
          item.name === DEFAULT_SEARCH_PARAMETER
            ? dropdownConfig.defaultParameterDisplay
            : getDisplayName(item.name)
        }
        </option>`,
    )}
    </select>`;
  }
}

if (!customElements.get("event-search-component")) {
  customElements.define("event-search-component", EventSearchComponent);
}
