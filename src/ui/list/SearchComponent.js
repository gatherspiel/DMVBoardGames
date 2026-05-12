import {
  DEFAULT_SEARCH_PARAMETER,
  getDaysOfWeekSelectHtml,
  getDaysOfWeekSelectedState,
  getDropdownHtml,
} from "../../shared/html/SelectGenerator.js";
import { BaseDynamicComponent } from "@bponnaluri/places-js";
import { CITY_LIST_STORE } from "../../data/list/CityListStore.js";
import {LOGIN_STORE} from "../../data/user/LoginStore.js";
import { SEARCH_RESULTS_LIST_STORE } from "../../data/list/SearchStores.js";

import { getDisplayName } from "../../shared/DisplayNameConversion.js";

const DEFAULT_PARAMETER_KEY = "defaultParameter";
const DEFAULT_PARAMETER_DISPLAY_KEY = "defaultParameterDisplay";
const ENABLE_SEARCH_TOGGLE_KEY = "enableSearchButton";
const SEARCH_BUTTON_ID = "search-button-id";
const SEARCH_DISTANCE_ID = "search-distance-id";
const SEARCH_USER_GROUPS_BUTTON_ID= "search-joined-id";
const SEARCH_CITY_ID = "search-cities";
const SEARCH_FORM_ID = "search-form";
const SHOW_DAY_SELECT = "show-day-select";

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
      }
    ]);

    this.initialParams = new URLSearchParams(document.location.search);

    this.defaultSearchParams = {
      apiUrl: this.getAttribute("api-url"),
      cityList:[DEFAULT_SEARCH_PARAMETER],
      days: this.initialParams.get("days"),
      distance: this.initialParams.get("distance")?.replaceAll("_", " "),
      location: this.initialParams.get("location"),

    };
    SEARCH_RESULTS_LIST_STORE.fetchData(this.defaultSearchParams);
  }

  connectedCallback(){
    this.updateData({
    ...{[ENABLE_SEARCH_TOGGLE_KEY]: this.initialParams.size === 0},
      ...this.defaultSearchParams,
    })
  }
  getTemplateStyle() {
    return `
     <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
     <link rel="stylesheet" type="text/css" href="/styles/kelp.css"/>
      
			<style>
        select {
          width:10rem;
        }
	
				.container-xl {
					margin-top:-2em;
				}
				
				.searchDropdownLabel {
          font-weight:600;
        }     
        
				#search-input-div {
					margin-top:0.5rem;
				}
				
				@media screen and (width > 32em) {
					fieldset label {
						display:inline;
					}
					#form-div-outer {
						margin-top: -1rem;
					}
				}
				
				@media screen and (width < 32em) {
					fieldset label {
						justify-content:center;
					}
					summary {
						font-weight:600;
					}
					
					#form-div-outer {
						margin-top: -1rem; 
						width: 100%
          }
          
					#search-cities {
            margin-bottom: 0.5rem; 
						margin-left:auto;
						margin-right:auto;	
					}

					#search-distance-id {
						margin-right:auto;
						margin-left:auto;
					}
					
					#search-input-div > button {
            margin-bottom: 0.5rem;
          }
			
					#search-form {
						margin-bottom:-1.5rem;
					}
					
					.container-xl {
						margin-top: -2.5rem;
					}
					
					.searchDropdownLabel {
						text-align:center;
						justify-content:center; 
          }
          
					.search-form-two-inputs {
            height:4rem;
          }
          
					.search-form-three-inputs {	
            height:7.5rem;
          }
			
        }
      </style>   
    `;
  }

  attachHandlersToShadowRoot(shadowRoot) {
    const self = this;
		
		shadowRoot.addEventListener("change", (event) => {
			console.log("Change"); 
			const eventTarget = event.target;

      if (eventTarget.id === SEARCH_CITY_ID) {
        self.updateData({
          [ENABLE_SEARCH_TOGGLE_KEY]: true,
          location: eventTarget.value,
        });
      } else if (eventTarget.id === SEARCH_DISTANCE_ID) {
        self.updateData({
          [ENABLE_SEARCH_TOGGLE_KEY]: true,
          distance: eventTarget.value,
        });
      }
    });

    
		shadowRoot.addEventListener("click", (event) => {
			
			if (event.target.type === "checkbox") {
				console.log(event.target);	
				const selectedDaysState = getDaysOfWeekSelectedState(shadowRoot);
			
				if(event.target.checked){
					selectedDaysState[event.target.id]="checked";
				} else {
					if(event.target.id in selectedDaysState){
						delete selectedDaysState[event.target.id];
					}	
				}
				
				console.log("Selected day state:"+JSON.stringify(selectedDaysState)); 
				self.updateData({
          [ENABLE_SEARCH_TOGGLE_KEY]: true,
          days:
            Object.keys(selectedDaysState).length > 0
              ? selectedDaysState
              : null,
        });
      }
      if (event.target.id === SEARCH_BUTTON_ID || event.target.id === SEARCH_USER_GROUPS_BUTTON_ID) {
			
			  event.preventDefault();
			    const searchParams = {
          location: self.componentStore.location ?? "",
          days: self.componentStore.days
            ? Object.keys(self.componentStore.days).join(",")
            : "",
          distance: self.componentStore.distance,
        };

        if(event.target.id === SEARCH_USER_GROUPS_BUTTON_ID){
          searchParams['userGroupEvents'] = "true";
        }

        self.updateData({
          [ENABLE_SEARCH_TOGGLE_KEY]: false,
        });

        const baseUrl = window.location.origin.split("?");
        let updatedUrl = `${baseUrl}?`;
        updatedUrl += `location=${searchParams.location.replaceAll(" ", "_")}&`;
        updatedUrl += `days=${searchParams.days.replaceAll(" ", "_")}&`;
        updatedUrl += `distance=${searchParams?.distance?.replaceAll(" ", "_") ?? ``}`;

        window.history.replaceState({}, "", updatedUrl);
        SEARCH_RESULTS_LIST_STORE.fetchData({
          ...searchParams,
          ...{ apiUrl: self.getAttribute("api-url") ?? "" },
        });
      }
      if (event.target.id === SHOW_DAY_SELECT) {
        self.updateData({
          showDaySelectOnMobile: !self.componentStore.showDaySelectOnMobile,
        });
      }
    });
  }

  render(store) {

    const isGroupSearch = this.getAttribute("search-text") === 'Search board game groups';
    const searchAllText = !isGroupSearch && store.loginState?.loggedIn === true ?
       "Search all events" : "Search"
    const searchInputsClass =
      store.location && store.location !== DEFAULT_SEARCH_PARAMETER
        ? "search-form-three-inputs"
        : "search-form-two-inputs";
    return `
			<div class="container-xl"> 
				<h1>${this.getAttribute("search-text")}</h1>

				<form id=${SEARCH_FORM_ID} onsubmit="return false">
					<div id ="form-div-outer">		
						<label class="hide-mobile searchDropdownLabel">Select event day: </label>
						
						<div class="show-mobile">
							<details>
								<summary>Select event day:</summary>
								<div>
									${getDaysOfWeekSelectHtml(store.days)}
								</div>
							</details>
						</div>	
						
						<div class="${store.showDaySelectOnMobile ? `` : `hide-mobile`}">
								${getDaysOfWeekSelectHtml(store.days)}
							</div>
						<div id="search-form-inputs" class="${searchInputsClass}">

							<label class="searchDropdownLabel">Select city: </label>
							
							${getDropdownHtml({
								data: store.cityList ?? [{ name: "Any location" }],
								id: SEARCH_CITY_ID,
								name: "cities",
								selected: store.location,
								[DEFAULT_PARAMETER_KEY]: DEFAULT_SEARCH_PARAMETER,
								[DEFAULT_PARAMETER_DISPLAY_KEY]: "Any location",
							})}
							${
								store.location && store.location !== DEFAULT_SEARCH_PARAMETER
									? `
							<label id="max-distance-label" class="searchDropdownLabel">Max distance:</label>

							${getDropdownHtml({
								data: DISTANCE_OPTIONS,
								id: SEARCH_DISTANCE_ID,
								name: "distance",
								selected: store.distance ?? "5 miles",
								[DEFAULT_PARAMETER_KEY]: "5 miles",
								[DEFAULT_PARAMETER_DISPLAY_KEY]: "5 miles",
							})}`
									: ``
							}     
						</div>  
						<div id="search-input-div"> 
							${
								store[ENABLE_SEARCH_TOGGLE_KEY]
									? `
										<button class="btn primary" id="${SEARCH_BUTTON_ID}">${searchAllText}</button>
									`: `
										<button class="btn muted" id="disabled-search-button">${searchAllText}</button>
									`	
							}
							${store.loginState?.loggedIn && !isGroupSearch ? 
								
								`${
									store[ENABLE_SEARCH_TOGGLE_KEY]
									?	`<button class="btn primary" id="${SEARCH_USER_GROUPS_BUTTON_ID}">Search joined groups</button>`
									: `<button class="btn muted" id="disabled-search-button-joined">Search joined groups</button>` 
								}	`
								:``
							}
						</div>
					</div>
				</form>
			<hr>
			</div>				

`;
  }
}
