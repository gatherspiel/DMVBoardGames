import {
  DEFAULT_SEARCH_PARAMETER,
  getDaysOfWeekSelect,
  getDaysOfWeekSelectHtml,
  getDaysOfWeekSelectState,
  getDropdown,
  getDropdownHtml,
} from "../../shared/html/SelectGenerator.js";
import { PresentationComponent} from "/lib/places-js-latest.js";
import { SEARCH_COMPONENT_STORE } from "../../data/list/SearchComponentStore.js";
import {LOGIN_STORE} from "../../data/user/LoginStore.js";
import { SEARCH_RESULTS_STORE } from "../../data/list/SearchResultsStore.js";

import { getDisplayName } from "../../shared/DisplayNameConversion.js";

import {searchWithDefaultParams} from "../../data/list/SearchResultsStore.js";

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
		super();

		SEARCH_COMPONENT_STORE.fetchData();
    searchWithDefaultParams(this.getAttribute("api-url"));
    this.setAttribute("search-button-enabled",false);
  	
    const checkboxUpdated = ()=>{  
		  this.setAttribute("search-button-enabled",true);
		}

		const distanceUpdated = () => { 
		  this.setAttribute("search-button-enabled",true);
		}

		const citiesUpdated = () => {
			this.setAttribute("search-button-enabled",true);
		}
		
		this.setChangeEvents({
			"citiesUpdated": citiesUpdated,
			"checkboxUpdated":checkboxUpdated,
			"distanceUpdated": distanceUpdated
		});

		const searchEvents = ()=>{

			this.setAttribute("search-button-enabled",false);

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

      SEARCH_RESULTS_STORE.fetchData({
        ...searchParams,
        ...{ apiUrl: this.getAttribute("api-url") ?? "" },
      });
    }
    
    const searchGroups = (e,component, state) =>{
      searchEvents(e,component, true);
    }
  
    this.setClickEvents({
      "searchEvents": searchEvents, 
      "searchGroups": searchGroups
    });
  }  
}

