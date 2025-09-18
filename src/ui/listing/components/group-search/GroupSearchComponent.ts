import {
  DEFAULT_SEARCH_PARAMETER,
} from "./Constants.ts";

import {
  CITY_LIST_STORE,
} from "../../data/search/CityListStore.ts";

import {BaseDynamicComponent} from "@bponnaluri/places-js";
import {generateButton} from "../../../../shared/components/ButtonGenerator.ts";
import {getDisplayName} from "../../../../shared/DisplayNameConversion.ts";
import {GROUP_SEARCH_STORE} from "../../data/search/GroupSearchStore.ts";

const DEFAULT_PARAMETER_KEY = "defaultParameter";
const DEFAULT_PARAMETER_DISPLAY_KEY = "defaultParameterDisplay";
const SEARCH_BUTTON_ID:string = "search-button-id";
const SEARCH_DISTANCE_ID:string = "search-distance-id";
const SEARCH_DAYS_ID:string = "search-days-id";
const SEARCH_CITY_ID: string = "search-cities";
const SEARCH_FORM_ID: string = "search-form";

const DAYS_IN_WEEK = [
  DEFAULT_SEARCH_PARAMETER,
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const DISTANCE_OPTIONS= [
  "0",
  "5",
  "10",
  "15",
  "30",
  "50",
];

export class GroupSearchComponent extends BaseDynamicComponent {

  constructor() {
    super([{
      componentReducer: (cityArray:any)=>{
        cityArray.sort();
        cityArray.unshift(DEFAULT_SEARCH_PARAMETER);
        return cityArray
      },
      dataStore:CITY_LIST_STORE,
      fieldName: "cityList"
    }]);
  }

  override getTemplateStyle(): string {
    return `
     <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
        #search-form {
          display: flex;
          flex-wrap: wrap;
          gap: 4rem;
          padding-bottom: 5px;
        }
        select {
          width:10rem;
        }
        .searchDropdownLabel {
          color: var(--clr-dark-blue);
          display: inline-block;
          width: 13rem;
        }
        #searchInputDiv {
          padding-top: 0.5rem;
        }
        @media not screen and (width < 32em) {
          select {
            margin-right: 1rem;
          }
        }    
        @media screen and (width < 32em) {
          #search-form {
            gap: 2rem;
          } 
        }
      </style>   
    `;
  }

  override attachHandlersToShadowRoot(shadowRoot?: any) {

    const self = this;
    shadowRoot.addEventListener("change",(event:any)=>{
      const eventTarget = event.target;
      if(eventTarget.id === SEARCH_DAYS_ID){
        self.updateData({
          day: (eventTarget as HTMLInputElement).value,
        })
      } else if(eventTarget.id === SEARCH_CITY_ID){
        self.updateData({
          location: (eventTarget  as HTMLInputElement).value,
        })
      } else if(eventTarget.id === SEARCH_DISTANCE_ID) {
        self.updateData({
          distance: (eventTarget as HTMLInputElement).value
        })
      }
    });

    shadowRoot.addEventListener("click",(event:any)=>{
      if(event.target.id === SEARCH_BUTTON_ID){
        event.preventDefault();
        const searchParams:any = {
          location: this.componentStore.location,
          day: this.componentStore.day,
          distance: this.componentStore.distance
        };
        GROUP_SEARCH_STORE.fetchData(searchParams)
      }
    });
  }

  render(store: any) {
    return `
  
      <form id=${SEARCH_FORM_ID} onsubmit="return false">
        <div>
          <div>
            <label class="searchDropdownLabel">Select event day: </label>
              ${this.getDropdownHtml({
                data: DAYS_IN_WEEK,
                id: SEARCH_DAYS_ID,
                name: "days",
                selected: store.day,
                [DEFAULT_PARAMETER_KEY]:DEFAULT_SEARCH_PARAMETER,
                [DEFAULT_PARAMETER_DISPLAY_KEY]: "Any day",
              })}
          </div>  
          <div>
            <label class="searchDropdownLabel">Select event city: </label>
            ${this.getDropdownHtml({
              data: store.cityList ?? [{name:"Any location"}],
              id: SEARCH_CITY_ID,
              name: "cities",
              selected: store.location,
              [DEFAULT_PARAMETER_KEY]:DEFAULT_SEARCH_PARAMETER,
              [DEFAULT_PARAMETER_DISPLAY_KEY]: "Any location",
            })}
          </div>  
          <div>
            ${store.location && store.location !== DEFAULT_SEARCH_PARAMETER ?`
            <label class="searchDropdownLabel">Select distance: </label>

            ${this.getDropdownHtml({
              data: DISTANCE_OPTIONS,
              id: SEARCH_DISTANCE_ID,
              name: "distance",
              selected: store.distance,
              [DEFAULT_PARAMETER_KEY]:"0 miles",
              [DEFAULT_PARAMETER_DISPLAY_KEY]: "0 miles",
            })}` :
          ``}       
          </div>
            
          <div id="searchInputDiv"> 
            ${generateButton({
              id: SEARCH_BUTTON_ID,
              text: "Search groups",
            })}
          </div>
        </div>
      </form>
    `;

  }

  getDropdownHtml(dropdownConfig: any) {

    return ` 
      <select class="form-select" id=${dropdownConfig.id}>
        ${dropdownConfig.data?.map(
          (item: any) =>
            `<option value="${item}" ${item === dropdownConfig.selected ? "selected" : ""}>
              ${
              item === DEFAULT_SEARCH_PARAMETER
                ? dropdownConfig.defaultParameterDisplay
                : getDisplayName(item)
            }
            </option>`,
        )}
      </select>`;
  }


}
