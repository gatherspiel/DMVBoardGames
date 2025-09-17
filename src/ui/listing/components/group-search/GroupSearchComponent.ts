import {
  DEFAULT_SEARCH_PARAMETER,
} from "./Constants.ts";

import {
  CITY_LIST_STORE,
  updateCities,
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

const template = `
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

const DAYS_IN_WEEK = [
  {index:0, name:DEFAULT_SEARCH_PARAMETER},
  {index:1,name: "Sunday"},
  {index:2, name:"Monday"},
  {index:3, name:"Tuesday"},
  {index:4, name:"Wednesday"},
  {index:5, name:"Thursday"},
  {index:6, name:"Friday"},
  {index:7, name:"Saturday"}
];

const DISTANCE_OPTIONS= [
  {index:0, name:"0"},
  {index:1,name: "5"},
  {index:2, name:"10"},
  {index:3, name:"15"},
  {index:4, name:"30"},
  {index:5, name:"50"},
];

const loadConfig = [{
  componentReducer: updateCities,
  dataStore:CITY_LIST_STORE,
  fieldName: "cityList"
}];

export class GroupSearchComponent extends BaseDynamicComponent {

  constructor() {
    super(loadConfig);
  }

  override getTemplateStyle(): string {
    return template;
  }

  override attachHandlersToShadowRoot(shadowRoot?: any) {

    const self = this;
    shadowRoot.addEventListener("change",(event:any)=>{
      const eventTarget = event.target.id;
      if(eventTarget === SEARCH_DAYS_ID){
        self.updateData({
          day: (event.target as HTMLInputElement).value,
        })
      } else if(eventTarget === SEARCH_CITY_ID){
        self.updateData({
          location: (event.target  as HTMLInputElement).value,
        })
      } else if(eventTarget === SEARCH_DISTANCE_ID) {
        self.updateData({
          distance: (event.target as HTMLInputElement).value
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
            <label class="searchDropdownLabel">Select event city: </label>
              ${this.getDropdownHtml({
                id: SEARCH_DAYS_ID,
                name: "days",
                data: DAYS_IN_WEEK,
                selected: store.day,
                [DEFAULT_PARAMETER_KEY]:DEFAULT_SEARCH_PARAMETER,
                [DEFAULT_PARAMETER_DISPLAY_KEY]: "Any day",
              })}
          </div>  
          <div>
            <label class="searchDropdownLabel">Select event city: </label>
            ${this.getDropdownHtml({
              id: SEARCH_CITY_ID,
              name: "cities",
              data: store.cityList ?? [{name:"Any location"}],
              selected: store.location,
              [DEFAULT_PARAMETER_KEY]:DEFAULT_SEARCH_PARAMETER,
              [DEFAULT_PARAMETER_DISPLAY_KEY]: "Any location",
            })}
          </div>  
          <div>
            ${store.location && store.location !== DEFAULT_SEARCH_PARAMETER ?`
            <label class="searchDropdownLabel">Select distance: </label>

            ${this.getDropdownHtml({
                id: SEARCH_DISTANCE_ID,
                name: "distance",
                data: DISTANCE_OPTIONS,
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
            `<option value="${item.name}" ${item.name === dropdownConfig.selected ? "selected" : ""}>
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
