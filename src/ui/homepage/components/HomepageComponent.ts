/*
  These imports are to load the Web Components that will be displayed.
 */

// @ts-ignore
import {GameRestaurantListComponent} from "./GameRestaurantListComponent.ts";
// @ts-ignore
import {GameStoreListComponent} from "./GameStoreListComponent.ts";
// @ts-ignore
import {ConventionListComponent} from "./ConventionListComponent.ts";
// @ts-ignore
import {GroupEventComponent} from "../../groups/viewGroup/components/GroupEventComponent.ts";
// @ts-ignore
import {EventListComponent} from "./event-list/EventListComponent.ts";
// @ts-ignore
import {EventSearchComponent} from "./event-search/EventSearchComponent.ts";
// @ts-ignore
import {OpenCreateGroupPageComponent} from "./OpenCreateGroupPageComponent.ts";

import {HOMEPAGE_COMPONENT_NAV} from "./HomepageComponentHandler.ts";
import {generateButton} from "../../../shared/components/ButtonGenerator.ts";

import {EVENT_HANDLER_CONFIG_KEY, EVENT_HANDLER_PARAMS_KEY, IS_LOGGED_IN_KEY} from "../../../shared/Constants.ts";
import {LOGIN_THUNK} from "../../auth/data/LoginThunk.ts";
import {LOCATIONS_THUNK} from "../data/search/LocationsThunk.ts";
import {EVENT_PRELOAD_THUNK, EVENT_SEARCH_THUNK} from "../data/search/EventSearchThunk.ts";
import {DEFAULT_SEARCH_PARAMETER} from "./event-search/Constants.ts";
import {CITY_LIST_THUNK} from "../data/search/CityListThunk.ts";
import {BaseDynamicComponent} from "../../../framework/components/BaseDynamicComponent.ts";

const loadConfig = {
  dataFields:[
    {
      fieldName: IS_LOGGED_IN_KEY,
      dataSource: LOGIN_THUNK
    },
    {
      fieldName: "gameLocations",
      dataSource: LOCATIONS_THUNK
    },
    {
      fieldName: "cityList",
      dataSource: CITY_LIST_THUNK
    },
    {
      fieldName: "searchResults",
      dataSource: EVENT_SEARCH_THUNK,
      preloadSource: EVENT_PRELOAD_THUNK,
      params: {
        city: DEFAULT_SEARCH_PARAMETER,
        day: DEFAULT_SEARCH_PARAMETER
      }
    }
  ]
}

export class HomepageComponent extends BaseDynamicComponent {
  constructor(enablePreload?:boolean){
    super("homepage-component",loadConfig, enablePreload);
  }

  connectedCallback(){
    this.updateStore({
      hideEvents: false,
      hideConventions: true,
      hideRestaurants: true,
      hideGameStores: true
    });
  }
  render(data:any){

    return `
        <div class="ui-section">
        <create-group-component>
        </create-group-component>
        <nav>
          <div id="nav-container">
            <div>Click for more info about</div>
            
            <div id = "more-info-div">
              <div class = "image-div">  
                <img src="/assets/house.png">
              </div>
              <div>
                ${data.hideEvents || data.showAllButtons ? generateButton({
                  text: "Events",
                  component: this,
                  [EVENT_HANDLER_CONFIG_KEY]: HOMEPAGE_COMPONENT_NAV,
                  [EVENT_HANDLER_PARAMS_KEY]: {location:"#event-search"}
                }): ``} 
                  
                ${data.hideConventions ? generateButton({
                  text: "Conventions",
                  component: this,
                  [EVENT_HANDLER_CONFIG_KEY]: HOMEPAGE_COMPONENT_NAV,
                  [EVENT_HANDLER_PARAMS_KEY]: {location:"#convention-list"}
                }): ``}       
             
                ${data.hideGameStores ? generateButton({
                  text: "Game Stores",
                  component: this,
                  [EVENT_HANDLER_CONFIG_KEY]: HOMEPAGE_COMPONENT_NAV,
                  [EVENT_HANDLER_PARAMS_KEY]: {location:"#game-store"}
                }): ``}  
             
                ${data.hideRestaurants ? generateButton({
                  text: "Bars and Cafés",
                  component: this,
                  [EVENT_HANDLER_CONFIG_KEY]: HOMEPAGE_COMPONENT_NAV,
                  [EVENT_HANDLER_PARAMS_KEY]: {location:"#game-restaurant"}
                }): ``} 
              </div>
            
            </div>
             
          </div>
        </nav>
      </div>
    
   
      <div id="event-search" class="page-section"></div>
    
      <div data-container="root">
        <event-search-component id="eventList" class="page-section" isVisible=${!data.hideEvents}>
        </event-search-component>
    
        <div class="ui-separator"></div>
    
        ${data && !data.hideEvents ? `
        <div id="event-list" class="page-section">
          <event-list-component></event-list-component>
        </div> `: ''}
    

        ${data && !data.hideConventions ? `
        <div id="convention-list" class="page-section">
          <convention-list-component data-test="testing">
            <p></p>
          </convention-list-component>
        </div>
        ` : ''}
    
 
      ${data && !data.hideRestaurants ?`
        <div id="game-restaurant-list" class="page-section">
          <game-restaurant-list-component></game-restaurant-list-component>
        </div>` : ''}
    
      ${data && !data.hideGameStores ? `
        <div id="game-store" class="page-section">
          <game-store-list-component></game-store-list-component>
        </div>` : ''}
      </div>
    </div>
    `
  }
}

if (!customElements.get("homepage-component")) {
  customElements.define("homepage-component", HomepageComponent);
}
