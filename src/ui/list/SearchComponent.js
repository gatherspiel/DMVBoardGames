import {
  DEFAULT_SEARCH_PARAMETER,
  getDaysOfWeekSelect,
  getDaysOfWeekSelectHtml,
  getDaysOfWeekSelectState,
  getDropdown,
  getDropdownHtml,
} from "../../shared/html/SelectGenerator.js";
import { BaseDynamicComponent } from "/lib/places-js-latest.js";
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
    console.log("Searching with url:"+this.getAttribute("api-url"));

    this.defaultSearchParams = {
      apiUrl: this.getAttribute("api-url"),
      cityList:[DEFAULT_SEARCH_PARAMETER],
      days: this.initialParams.get("days"),
      distance: this.initialParams.get("distance")?.replaceAll("_", " "),
      location: this.initialParams.get("location"),
    };
    SEARCH_RESULTS_LIST_STORE.fetchData(this.defaultSearchParams);
    
    BaseDynamicComponent.defineTemplate(SearchFormTemplate,"SearchFormTemplate");  
  }

  connectedCallback(){
    this.updateData({
      ...{[ENABLE_SEARCH_TOGGLE_KEY]: this.initialParams.size === 0},
      ...this.defaultSearchParams,
    })
  }


  render(state) {  
    const potato = (data) =>{
      console.log("Hi");
    }
    
    return `
      <div 
        class="container-xl" 
        data-show-if="isMobile"
        onClick={{${()=>potato},"Test"}}
      >
      </div>
    `;
  }
 
  isMobile(state){
    return {
      showIf: ()=>{
        return window.matchMedia("(max-width: 32em)").matches;
      },
      fallback: 
        `<div class="hide-mobile"><h1>${this.getAttribute("search-text")}</h1></div>
          <form
            data-template-name=SearchFormTemplate
            onsubmit="return false"
          >
        </div>
      `,
      isVisible: `<details ${state.showSearchUiMobile ? "open":""}>
        <summary class="btn secondary">Modify search parameters</summary>
        <form
          data-template-name=SearchFormTemplate
          id=${SEARCH_FORM_ID}
          onsubmit="return false"
        >
        </hr> 
      </details>`
    }
  } 
}

const SearchFormTemplate = ()=>{

  SearchFormTemplate.searchEvents = (e,component, state, searchGroups=false)=>{
    const searchParams = {
      location: data.location ?? "",
      days: getDaysOfWeekSelectedState, 
      distance: data.distance,
    };

    searchParams['userGroupEvents'] = `${searchGroups}`
    
    component.updateData({
      [ENABLE_SEARCH_TOGGLE_KEY]: false,
      showSearchUiMObile: false
    });
    
    const baseUrl = window.location.origin.split("?");
    let updatedUrl = `${baseUrl}?`;
    updatedUrl += `location=${searchParams.location.replaceAll(" ", "_")}&`;
    updatedUrl += `days=${searchParams.days.replaceAll(" ", "_")}&`;
    updatedUrl += `distance=${searchParams?.distance?.replaceAll(" ", "_") ?? ``}`;

    window.history.replaceState({}, "", updatedUrl);
    SEARCH_RESULTS_LIST_STORE.fetchData({
      ...searchParams,
      ...{ apiUrl: component.getAttribute("api-url") ?? "" },
    });
  }
  
  SearchFormTemplate.searchGroups = (e,component, state) =>{
    SearchFormTemplate.searchEvents(e,component, true);
  }
 
  SearchFormTemplate.checkboxUpdated = (e,component)=>{
    component.updateData({
      enableSearchButtonKey: true,
      showSearchUiMobile: true
    });
  }

  SearchFormTemplate.citiesUpdated = (e,component)=>{
    component.updateData({
        [ENABLE_SEARCH_TOGGLE_KEY]: true,
        location: eventTarget.value,
        showSearchUiMobile: true
      });
    }

  SearchFormTemplate.distanceUpdated = () => {
    self.updateData({
      [ENABLE_SEARCH_TOGGLE_KEY]: true,
      distance: eventTarget.value,
      showSearchUiMobile: true 
    });
  }
  
  SearchFormTemplate.searchInputClass = (state) => {
    if(state.location && state.location !== DEFAULT_SEARCH_PARAMETER){
      return "search-form-three-inputs";
    } else {
      return "search-form-two-inputs";
    }
  }

  SearchFormTemplate.searchAllText = (state) => {
    if(state.apiUrl==="/searchEvents" && state.loginState?.loggedIn) {
      return "Search all events";
    } else {
      return "Search"
    }
  }
 
  SearchFormTemplate.getDaysSelect = () => {
    return getDaysOfWeekSelect();
  }
 
  SearchFormTemplate.getCitySelect = (state) => {
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

  SearchFormTemplate.getDistanceSelect = (state) => {
    return `
      <label id="max-distance-label" class="searchDropdownLabel">Max distance:</label>
      ${getDropdown({
        state: DISTANCE_OPTIONS,
        id: "search-distance-id",
        name: "distance",
        selected: state.distance ?? "5 miles",
        [DEFAULT_PARAMETER_KEY]: "5 miles",
        [DEFAULT_PARAMETER_DISPLAY_KEY]: "5 miles",
      })}`
  }
  
  SearchFormTemplate.distanceSelectVisible = (state) => {
    if(state.location && state.location !== DEFAULT_SEARCH_PARAMETER){
      return "";
    }
    return "none";
  }
 
  SearchFormTemplate.searchBtnCls = (state)=>{
    if(state[ENABLE_SEARCH_TOGGLE_KEY]){
      return "btn primary"
    } else {
      return "btn muted"
    }
  }

  SearchFormTemplate.searchBtnId = (state)=>{
    if(state[ENABLE_SEARCH_TOGGLE_KEY]){
      return "search-button-id";
    } else {
      return "disabled-search-button";
    }
  }

  SearchFormTemplate.searchBtnIdUser = (state)=>{
    if(state[ENABLE_SEARCH_TOGGLE_KEY]){
      return "search-joined-id"
    } else {
      return "disabled-search-joined"
    }
  } 
  
  SearchFormTemplate.notLoggedIn = (state)=>{
    if(state?.loginState?.loggedIn === true){
      return false;
    }
    return true;
  }
 
  return `
    <div id="form-div-outer">    
      <div  
        class={{searchInputClass}}
        id="search-form-inputs" 
      > 
        <label 
          class="searchDropdownLabel"
        >Select event day: </label>     
        <fieldset
          onClick={{checkboxUpdated}}
        >
          {{getDaysSelect}}
        </fieldset>
        <label 
          class="searchDropdownLabel"
        >Select city: </label> 
        <select> 
          {{getCitySelect}}
        </select>
        <select 
          display={{distanceSelectVisible}}
        >
          {{getDistanceSelect}} 
        </select>
      </div>  
      <div 
        id = "search-input-div"
      >
        <button
          class={{searchBtnCls}}
          id={{searchBtnId}}
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
      </div>` 
  }
