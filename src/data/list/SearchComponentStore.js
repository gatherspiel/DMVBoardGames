import { ApiLoadAction, DataStore } from "/lib/places-js-latest.js";
import { API_ROOT } from "../../ui/shared/Params.js";
import {LOGIN_STORE} from "../user/LoginStore.js";

import {
  DEFAULT_SEARCH_PARAMETER,
  getDaysOfWeekSelect,
  getDaysOfWeekSelectHtml,
  getDaysOfWeekSelectState,
  getDropdown,
  getDropdownHtml
} from "/shared/html/SelectGenerator.js"

import { getDisplayName } from "/shared/DisplayNameConversion.js";

const DEFAULT_PARAMETER_KEY = "defaultParameter";
const DEFAULT_PARAMETER_DISPLAY_KEY = "defaultParameterDisplay";
const DISTANCE_OPTIONS = [
  "0 miles",
  "5 miles",
  "10 miles",
  "15 miles",
  "30 miles",
  "50 miles",
];
const ENABLE_SEARCH_TOGGLE_KEY = "enableSearchButton";

function getCitiesQueryConfig() {
  return {
    url: API_ROOT + "/listCities?area=dmv",
  };
}

export const CITY_LIST_STORE = new DataStore(
  new ApiLoadAction(getCitiesQueryConfig),
	"city-list-store"
);

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

  const displayCities = [];
  state.cities.forEach((city)=>{
    displayCities.push(getDisplayName(city));
  });
  displayCities.sort();
  displayCities.unshift(DEFAULT_SEARCH_PARAMETER);
	const cityList = getDropdown({
		state: displayCities,
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

const presentationSignals = {
  "update":{
    "searchInputClass":searchInputClass,
    "getDaysSelect":getDaysSelect,
    "getCitySelect":getCitySelect,
    "distanceSelectVisible":distanceSelectVisible,
    "getDistanceSelect":getDistanceSelect,
    "searchBtnClass":searchBtnCls,
    "searchBtnIdUser":searchBtnId,
    "searchAllText":searchAllText,
    "notLoggedIn":notLoggedIn,
  }
}

export const SEARCH_COMPONENT_STORE = 
  DataStore.createWithDataStoreSignals({
    "presentationSignals": presentationSignals, 
    "storeName": "search-component-store",
    "storeSignals": [
      {
        fieldName: "cities",
        store: CITY_LIST_STORE
      },
      {
        fieldName: "loginStatus",
        store: LOGIN_STORE
      }
    ],
  })

