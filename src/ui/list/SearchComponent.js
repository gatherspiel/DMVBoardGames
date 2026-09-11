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
    this.setAttribute("search-button-enabled",false);
  		const checkboxUpdated = ({componentAttrs})=>{  
			componentAttrs["search-button-enabled"].value=true;
		}

		const distanceUpdated = ({componentAttrs}) => { 
			componentAttrs["search-button-enabled"].value=true;
		}

		const citiesUpdated = ({componentAttrs}) => {
			componentAttrs["search-button-enabled"].value=true;
		}
		
		this.setChangeEvents({
			"citiesUpdated": citiesUpdated,
			"checkboxUpdated":checkboxUpdated,
			"distanceUpdated": distanceUpdated
		});

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

      SEARCH_RESULTS_STORE.fetchData({
        ...searchParams,
        ...{ apiUrl: componentAttrs.getNamedItem("api-url").value ?? "" },
      });
    }
    
    const searchGroups = (e,component, state) =>{
      searchEvents(e,component, true);
    }
  
    this.setChangeEvents({
      "searchEvents": searchEvents, 
      "searchGroups": searchGroups
    });
  }  
}

