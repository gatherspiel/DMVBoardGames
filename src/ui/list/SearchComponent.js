import {
  DEFAULT_SEARCH_PARAMETER,
  getDaysOfWeekSelect,
  getDaysOfWeekSelectHtml,
  getDaysOfWeekSelectState,
  getDropdown,
  getDropdownHtml,
} from "../../shared/html/SelectGenerator.js";
import { PresentationComponent} from "/lib/places-js-latest.js";
import { CITY_LIST_STORE } from "../../data/list/CityListStore.js";
import {LOGIN_STORE} from "../../data/user/LoginStore.js";
import { SEARCH_RESULTS_LIST_STORE } from "../../data/list/SearchStores.js";

import { getDisplayName } from "../../shared/DisplayNameConversion.js";

const DEFAULT_PARAMETER_KEY = "defaultParameter";
const DEFAULT_PARAMETER_DISPLAY_KEY = "defaultParameterDisplay";
const ENABLE_SEARCH_TOGGLE_KEY = "enableSearchButton";
const SEARCH_DISTANCE_ID = "search-distance-id";
const SEARCH_USER_GROUPS_BUTTON_ID= "search-joined-id";
const SEARCH_CITY_ID = "search-cities-id";
const SEARCH_FORM_ID = "search-form";

const DISTANCE_OPTIONS = [
  "0 miles",
  "5 miles",
  "10 miles",
  "15 miles",
  "30 miles",
  "50 miles",
];

export class SearchComponent extends PresentationComponent {

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
          return copy
        },
        dataStore: CITY_LIST_STORE,
        fieldName: "cityList"
      },
      {
        dataStore: LOGIN_STORE,
        fieldName: "loginState"
      },
      {
        componentReducer:(data)=> {          
          if(data.eventData && data.eventData.length > 0){
            return false;
          } 
          if(data.groupData && data.groupData.length > 0){
            return false;
          }
          return true;
        },
        dataStore: SEARCH_RESULTS_LIST_STORE,
        fieldName: "showSearchUiMobile"
      }
    ]);

    this.initialParams = new URLSearchParams(document.location.search);

		console.log("Beginning search");
		console.log(this.getAttribute("api-url"));
    this.defaultSearchParams = {
      apiUrl: this.getAttribute("api-url"),
      cityList:[DEFAULT_SEARCH_PARAMETER],
      days: this.initialParams.get("days"),
      distance: this.initialParams.get("distance")?.replaceAll("_", " "),
      location: this.initialParams.get("location"),
    };
    SEARCH_RESULTS_LIST_STORE.fetchData(this.defaultSearchParams);
   

    this.setAttribute("search-button-enabled",false);
  }

  connectedCallback(){
    this.init(this.defaultSearchParams);
  }

  render(state) {  
    

    if(window.matchMedia("(max-width: 32em)").matches){
      return `
        <div class="container-xl">
          <details class="show-mobile" open>
            <summary class="btn secondary">Modify search parameters</summary>
            <form
              data-component=SearchForm
              id=${SEARCH_FORM_ID}
              onsubmit="return false"
            ></form>
            </hr> 
          </details>
        </div>
      `
    }
    return `
      <div class="container-xl" > 
        <div class="hide-mobile"><h1>${this.getAttribute("search-text")}</h1>
          <form
            data-component=SearchForm
            onsubmit="return false"
          ></form>
        </div>
      </div>
    `;
  }
}

class SearchForm extends PresentationComponent {

  changeHandlers() {

    const checkboxUpdated = ({componentAttrs})=>{  
      componentAttrs["search-button-enabled"].value=true;
    }

    const distanceUpdated = ({componentAttrs}) => { 
      componentAttrs["search-button-enabled"].value=true;
    }

    const citiesUpdated = ({componentAttrs}) => {
      componentAttrs["search-button-enabled"].value=true;
    }
    
    return {
      "citiesUpdated": citiesUpdated,
      "checkboxUpdated":checkboxUpdated,
      "distanceUpdated": distanceUpdated
    }
  }
  
  clickHandlers() {
     
    const searchEvents = ({componentAttrs})=>{

      componentAttrs["search-button-enabled"].value=false;

      const searchParams = {
        location: document.getElementById(`select-city`).value ?? "",
        days: getDaysOfWeekSelectState("#select-days").join(","), 
        distance: document.getElementById(`select-distance`).value ?? ''
      };

      searchParams['userGroupEvents'] = `${searchGroups}`
      
   
      const baseUrl = window.location.origin.split("?");
      let updatedUrl = `${baseUrl}?`;
      updatedUrl += `location=${searchParams.location.replaceAll(" ", "_")}&`;
      updatedUrl += `days=${searchParams.days.replaceAll(" ", "_")}&`;
      updatedUrl += `distance=${searchParams?.distance?.replaceAll(" ", "_") ?? ``}`;

      window.history.replaceState({}, "", updatedUrl);

      SEARCH_RESULTS_LIST_STORE.fetchData({
        ...searchParams,
        ...{ apiUrl: componentAttrs.getNamedItem("api-url").value ?? "" },
      });
    }
    
    const searchGroups = (e,component, state) =>{
      searchEvents(e,component, true);
    }

  
    return {
      "searchEvents": searchEvents, 
      "searchGroups": searchGroups
    };
  }
 
  
  defineComputedState(){
     
    const searchInputClass = (state) => {
      if(state.location && state.location !== DEFAULT_SEARCH_PARAMETER){
        return "search-form-three-inputs";
      } else {
        return "search-form-two-inputs";
      }
    }

    const searchAllText = (state) => {
      if(state.apiUrl==="/searchEvents" && state.loginState?.loggedIn) {
        return "Search all events";
      } else {
        return "Search"
      }
    }
 
    const getDaysSelect = () => {
      return getDaysOfWeekSelect();
    }
 
    const getCitySelect = (state) => {
      const cityList = getDropdown({
        state: state.cityList ?? [{ name: "Any location" }],
        id: "search-cities-id",
        name: "cities",
        selected: state.location,
        [DEFAULT_PARAMETER_KEY]: DEFAULT_SEARCH_PARAMETER,
        [DEFAULT_PARAMETER_DISPLAY_KEY]: "Any location",
      });
      return cityList;
    }

    const getDistanceSelect = (state) => {
      return `
        ${getDropdown({
          state: DISTANCE_OPTIONS,
          id: "search-distance-id",
          name: "distance",
          selected: state.distance ?? "5 miles",
          [DEFAULT_PARAMETER_KEY]: "5 miles",
          [DEFAULT_PARAMETER_DISPLAY_KEY]: "5 miles",
        })}`
    }
    
    const distanceSelectVisible = (state) => {
      if(state.location && state.location !== DEFAULT_SEARCH_PARAMETER){
        return "";
      }
      return "none";
    }
 
    const searchBtnCls = (state)=>{
      if(state[ENABLE_SEARCH_TOGGLE_KEY]){
        return "btn primary"
      } else {
        return "btn muted"
      }
    }

    const searchBtnId = (state)=>{
      if(state[ENABLE_SEARCH_TOGGLE_KEY]){
        return "search-button-id";
      } else {
        return "disabled-search-button";
      }
    }
  
    const notLoggedIn = (state)=>{
      if(state?.loginState?.loggedIn === true){
        return false;
      }
      return true;
    }

    return {
      "searchInputClass":searchInputClass,
      "getDaysSelect":getDaysSelect,
      "getCitySelect":getCitySelect,
      "distanceSelectVisible":distanceSelectVisible,
      "getDistanceSelect":getDistanceSelect,
      "searchBtnCls":searchBtnCls,
      "searchBtnId":searchBtnId,
      "searchAllText":searchAllText,
      "notLoggedIn":notLoggedIn,
    }
  }

  defineTemplate(){ 
    return `
      <div id="form-div-outer">    
        <div  
          class={{searchInputClass}}
          id="search-form-inputs" 
        > 
          <label class="searchDropdownLabel">
            Select event day: 
          </label>     

          <fieldset
            id = "select-days"
            onChange={{checkboxUpdated}}>
              {{getDaysSelect}}
          </fieldset>

          <label class="searchDropdownLabel">
            Select city: 
          </label>

          <select 
            id="select-city"
            onChange={{citiesUpdated}}
          >
            {{getCitySelect}}
          </select>
          
          <div id="select-distance-outer">
            <label id="max-distance-label" class="searchDropdownLabel">Max distance:</label>
            <select
              id="select-distance"
              onChange={{distanceUpdated}}
              >
              {{getDistanceSelect}} 
            </select>
          </div>
        <div 
          id = "search-input-div"
        >
          <button
            class="secondary"
            id="search-button"
            onClick={{searchEvents}}
          >
            {{searchAllText}}
          </button>
          <button 
            class={{searchBtnClass}}
            hidden={{notLoggedIn}}
            id={{searchBtnIdUser}}
            onClick={{searchGroups}}
          >
            Search joined groups
          </button> 
        </div>
        </div>  

      </div>
    `;
  }
}

