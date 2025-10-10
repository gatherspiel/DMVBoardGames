import {
  DEFAULT_SEARCH_PARAMETER,
} from "./Constants.ts";

import {
  CITY_LIST_STORE,
} from "../../data/search/CityListStore.ts";

import {BaseDynamicComponent} from "@bponnaluri/places-js";
import {generateButton, generateDisabledButton} from "../../../../shared/html/ButtonGenerator.ts";
import {GROUP_SEARCH_STORE} from "../../data/search/GroupSearchStore.ts";
import {
  getDaysOfWeekSelectedState,
  getDaysOfWeekSelectHtml,
  getDropdownHtml
} from "../../../../shared/html/SelectGenerator.ts";
import {getDisplayName} from "../../../../shared/data/DisplayNameConversion.ts";

const DEFAULT_PARAMETER_KEY = "defaultParameter";
const DEFAULT_PARAMETER_DISPLAY_KEY = "defaultParameterDisplay";
const SEARCH_BUTTON_ID:string = "search-button-id";
const SEARCH_DISTANCE_ID:string = "search-distance-id";
const SEARCH_CITY_ID: string = "search-cities";
const SEARCH_FORM_ID: string = "search-form";
const SHOW_DAY_SELECT:string="show-day-select";

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
      componentReducer: (cityArray:string[])=>{
        const copy:string[] = [];
        cityArray.forEach((city:string)=>{
          copy.push(getDisplayName(city))
        })
        copy.sort();
        copy.unshift(DEFAULT_SEARCH_PARAMETER);
        return copy
      },
      dataStore:CITY_LIST_STORE,
      fieldName: "cityList"
    }]);
  }
  override getTemplateStyle(): string {
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
            width: 8rem;
          }
          #search-form .form-item {
            display: inline-block;
          }
          .raised {
            display: inline-block;
          }
        }     
        @media screen and (width < 32em) {
          #form-div-outer {
            width: 100%
          }
          #search-cities {
            margin-top:0.5rem;
          }
          #search-distance-id {
            margin-top:0.5rem;
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

  override attachHandlersToShadowRoot(shadowRoot?: any) {

    const self = this;
    shadowRoot.addEventListener("change",(event:any)=>{
      const eventTarget = event.target;
      if(eventTarget.id === SEARCH_CITY_ID){
        self.updateData({
          location: (eventTarget  as HTMLInputElement).value,
        })
      } else if(eventTarget.id === SEARCH_DISTANCE_ID) {
        self.updateData({
          distance: (eventTarget as HTMLInputElement).value
        })
      }

      if(event.target.type === "checkbox"){
        const selectedDaysState:Record<string, string> = getDaysOfWeekSelectedState(shadowRoot);
        self.updateData({
          selectedDays: Object.keys(selectedDaysState).length > 0 ? selectedDaysState : null
        })
      }
    });

    shadowRoot.addEventListener("click",(event:any)=>{

      if(event.target.id === SEARCH_BUTTON_ID){
        event.preventDefault();
        const searchParams:any = {
          location: self.componentStore.location,
          day: self.componentStore.selectedDays ? Object.keys(self.componentStore.selectedDays).join(",") : '',
          distance: self.componentStore.distance
        };
        GROUP_SEARCH_STORE.fetchData(searchParams)
      }
      if(event.target.id === SHOW_DAY_SELECT){
        self.updateData({
          showDaySelectOnMobile: !self.componentStore.showDaySelectOnMobile
        })
      }
    });
  }

  render(store: any) {

    const searchButtonEnabled =
      store.selectedDays || store.location;

    const searchInputsClass = store.location && store.location !== DEFAULT_SEARCH_PARAMETER ?
      "search-form-three-inputs" : "search-form-two-inputs"
    return `


      <h1 id="group-search-header">Search groups</h1>

      <form id=${SEARCH_FORM_ID} onsubmit="return false">
        <div id ="form-div-outer">
          <label class="searchDropdownLabel">Select event day: </label>

          ${store.showDaySelectOnMobile ?
            generateButton({
              class:"show-mobile",
              id: SHOW_DAY_SELECT,
              text:"-"
            }) :
            generateButton({
              class:"show-mobile",
              id: SHOW_DAY_SELECT,
              text:"+"
            })
          }
          
          <div class="${store.showDaySelectOnMobile ? `` : `hide-mobile`}">
              ${getDaysOfWeekSelectHtml(store.selectedDays)}
            </div>
          <div id="search-form-inputs" class="${searchInputsClass}">

            <label class="searchDropdownLabel">Select event city: </label>
            ${getDropdownHtml({
              data: store.cityList ?? [{name:"Any location"}],
              id: SEARCH_CITY_ID,
              name: "cities",
              selected: store.location,
              [DEFAULT_PARAMETER_KEY]:DEFAULT_SEARCH_PARAMETER,
              [DEFAULT_PARAMETER_DISPLAY_KEY]: "Any location",
            })}
            ${store.location && store.location !== DEFAULT_SEARCH_PARAMETER ?`
            <br>
            <label id="max-distance-label" class="searchDropdownLabel">Max distance:</label>

            ${getDropdownHtml({
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
            ${searchButtonEnabled ?
              `${generateButton({
                id: SEARCH_BUTTON_ID,
                text: "Search groups",
              })}` :
              `${generateDisabledButton({
                id: 'disabled-search-button',
                text: "Search",
              })}`
            }
          </div>
        </div>
      </form>
    `;
  }


}
