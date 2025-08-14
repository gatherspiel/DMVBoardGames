import {
  DAYS_IN_WEEK,
  DEFAULT_SEARCH_PARAMETER, DISTANCE_OPTIONS, SEARCH_CITY_ID,
  SEARCH_FORM_ID
} from "./Constants.ts";

import {
  updateCities,
} from "../../data/search/CityListThunk.ts";
import {
  SEARCH_EVENT_HANDLER_CONFIG, UPDATE_CITY_CONFIG, UPDATE_DAY_CONFIG, UPDATE_DISTANCE_CONFIG,
} from "./EventSearchHandlers.ts";
import { BaseTemplateDynamicComponent } from "../../../../framework/components/BaseTemplateDynamicComponent.ts";
import {generateButton} from "../../../../shared/components/ButtonGenerator.ts";
import type {DropdownConfig} from "../../../../framework/components/types/DropdownConfig.ts";
import {getDisplayName} from "../../../../shared/DisplayNameConversion.ts";
import {
  DEFAULT_GLOBAL_STATE_REDUCER_KEY,
  GLOBAL_FIELD_SUBSCRIPTIONS_KEY, GLOBAL_STATE_LOAD_CONFIG_KEY,
} from "../../../../framework/components/types/ComponentLoadConfig.ts";
import {
  DEFAULT_PARAMETER_DISPLAY_KEY,
  DEFAULT_PARAMETER_KEY,
  EVENT_HANDLER_CONFIG_KEY
} from "../../../../shared/Constants.ts";
const loadConfig = {
  [GLOBAL_STATE_LOAD_CONFIG_KEY]: {
    [GLOBAL_FIELD_SUBSCRIPTIONS_KEY]: ["cityList"],
    [DEFAULT_GLOBAL_STATE_REDUCER_KEY]: updateCities
  }
};

const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>

  <style>
  
  #event-search {
    border-top: 1px solid var(--clr-lighter-blue);
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
    
  #searchInputDiv {
    align-items: center;
    display:flex;
    height:3.5rem;
  }
  
  #searchInputDiv img {
    padding-top:20px;
  }
  
  .image-div {
    padding-right:0.5rem;
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
  }

  override getTemplateStyle(): string {
    return template;
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
            
              <div id="searchInputDiv"> 
                <div class = "image-div">  
                  <img src="/assets/house.png">
                </div>
                
                <div> 
                 ${generateButton({
                  text: "Search groups",
                  class: "search-button",
                  component: this,
                  [EVENT_HANDLER_CONFIG_KEY]: SEARCH_EVENT_HANDLER_CONFIG,
                })}
                </div> 
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
