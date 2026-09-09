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
				dataStore: CITY_LIST_STORE,
				fieldName: "cityList"
			},
			{
				dataStore: LOGIN_STORE,
				fieldName: "loginState"
			}			
		]);
    this.setAttribute("search-button-enabled",false);
  }

	connectedCallback(){
		CITY_LIST_STORE.fetchData();

		

		//TODO:  Add conditional check here
		/*
			this.addTemplateFunction(showMobile)

		*/
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

}

