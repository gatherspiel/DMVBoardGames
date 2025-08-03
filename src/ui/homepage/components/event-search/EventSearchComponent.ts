import {
  DAYS_IN_WEEK,
  DEFAULT_SEARCH_PARAMETER, DISTANCE_OPTIONS, SEARCH_CITY_ID,
  SEARCH_FORM_ID
} from "./Constants.ts";

import {EVENT_PRELOAD_THUNK, EVENT_SEARCH_THUNK} from "../../data/search/EventSearchThunk.ts";
import {
  CITY_LIST_THUNK,
  updateCities,
} from "../../data/search/CityListThunk.ts";
import {
  SEARCH_EVENT_HANDLER_CONFIG, UPDATE_CITY_CONFIG, UPDATE_DAY_CONFIG, UPDATE_DISTANCE_CONFIG,
} from "./EventSearchHandlers.ts";
import { BaseTemplateDynamicComponent } from "../../../../framework/components/BaseTemplateDynamicComponent.ts";
import {LOCATIONS_THUNK} from "../../data/search/LocationsThunk.ts";
import {initRequestStore} from "../../../../framework/state/data/RequestStore.ts";
import {PageState} from "../../../../framework/state/PageState.ts";
import {generateButton} from "../../../../shared/components/ButtonGenerator.ts";
import type {DropdownConfig} from "../../../../framework/components/types/DropdownConfig.ts";
import {getDisplayName} from "../../../../shared/DisplayNameConversion.ts";
const loadConfig = {
  onLoadStoreConfig: {
    dataSource: EVENT_PRELOAD_THUNK,
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
  requestThunkReducers: [
    {
      thunk: EVENT_PRELOAD_THUNK,
      componentStoreReducer: function(data: any){
        return data;
      }
    },
    {
      thunk: CITY_LIST_THUNK,
      componentStoreReducer: updateCities,
    }
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
  
  select {
    width:10rem;
  }
  
  #search-distance {
      margin-left:1rem;
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

  connectedCallback(){
    if(PageState.pageLoaded){
      //@ts-ignore
      loadConfig.onLoadStoreConfig.dataSource = EVENT_SEARCH_THUNK
      initRequestStore(loadConfig);
    }
  }

  render(eventSearchStore: any) {

    if(!this.getAttribute("isVisible") || this.getAttribute("isVisible")=== "false"){
      return ''
    }
    return `
   
      <div class="ui-section">
        <form id=${SEARCH_FORM_ID}>
          <div id='search-input-wrapper'>
             <div>
              ${this.getDropdownHtml({
              label:"Select event day:",
              id: 'search-days',
              name: "days",
              data: DAYS_IN_WEEK,
              selected: eventSearchStore.day,
              defaultParameter:DEFAULT_SEARCH_PARAMETER,
              defaultParameterDisplay: "Any day",
              eventHandlerConfig: UPDATE_DAY_CONFIG
            })}
            </div>
            <div>
              ${this.getDropdownHtml({
                label:"Select event city:",
                id: SEARCH_CITY_ID,
                name: "cities",
                data: eventSearchStore.cities ?? [{name:"Any location"}],
                selected: eventSearchStore.location,
                defaultParameter:DEFAULT_SEARCH_PARAMETER,
                defaultParameterDisplay: "Any location",
                eventHandlerConfig: UPDATE_CITY_CONFIG
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
                defaultParameter:"0 miles",
                defaultParameterDisplay: "0 miles",
                eventHandlerConfig: UPDATE_DISTANCE_CONFIG
                
              })}</div>` :
               ``}
            
           
            
            
            <div> 
              ${generateButton({
                text: "Search groups",
                component: this,
                eventHandlerConfig: SEARCH_EVENT_HANDLER_CONFIG,
              })}
            </div>
          </div>
        </form>
      </div>
  `;

  }

  getDropdownHtml(dropdownConfig: DropdownConfig) {
    return ` 
    <label>${dropdownConfig.label} </label>
    <select
      id=${dropdownConfig.id}
      name=${dropdownConfig.name}
      value=${dropdownConfig.data}
      ${this.createOnChangeEvent(dropdownConfig.eventHandlerConfig)}
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
