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

import {generateButton} from "../../../shared/components/ButtonGenerator.ts";

import {IS_LOGGED_IN_KEY} from "../../../shared/Constants.ts";
import {LOGIN_THUNK} from "../../auth/data/LoginThunk.ts";
import {LOCATIONS_THUNK} from "../data/search/LocationsThunk.ts";
import {EVENT_PRELOAD_THUNK, EVENT_SEARCH_THUNK} from "../data/search/EventSearchThunk.ts";
import {DEFAULT_SEARCH_PARAMETER} from "./event-search/Constants.ts";
import {CITY_LIST_THUNK} from "../data/search/CityListThunk.ts";

import {BaseDynamicComponent} from "@bponnaluri/places-js";

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
const CONVENTIONS_ID = "convention-list";
const EVENT_SEARCH_ID ="event-search";
const GAME_RESTAURANTS_ID="game-restaurants";
const GAME_STORES_ID="game-stores";

export class HomepageComponent extends BaseDynamicComponent {
  constructor(enablePreload?:boolean){
    super(loadConfig, enablePreload);
  }

  connectedCallback() {
    this.retrieveData({
      hideEvents: false,
      hideConventions: true,
      hideRestaurants: true,
      hideGameStores: true
    });
    const self = this;

    this.addEventListener("click", function (event: any) {
      event.preventDefault();
      const targetId = event.originalTarget.id;
      if (event.target.id === 'event-search-component') {
        event.target.handleClickEvents(event);
      } else {
        if ([CONVENTIONS_ID, EVENT_SEARCH_ID, GAME_RESTAURANTS_ID, GAME_STORES_ID].includes(targetId)) {
          self.retrieveData({
            hideEvents: targetId !== EVENT_SEARCH_ID,
            hideConventions: targetId !== CONVENTIONS_ID,
            hideRestaurants: targetId !== GAME_RESTAURANTS_ID,
            hideGameStores: targetId !== GAME_STORES_ID
          })
        }
      }
    })
  }

  render(data:any){
    return `
        <div class="ui-section">
        <open-create-group-component>
        </open-create-group-component>
        <nav>
          <div id="nav-container">
            <div>Click for more info about</div>
            
            <div class = "homepage-default-action-div">
              <div class = "image-div">  
                <img src="/assets/house.png">
              </div>
              <div>
                ${data.hideEvents || data.showAllButtons ? generateButton({
                  component: this,
                  id: EVENT_SEARCH_ID,
                  text: "Events",
                }): ``} 
                  
                ${data.hideConventions ? generateButton({
                  component: this,
                  id: CONVENTIONS_ID,
                  text: "Conventions",
                }): ``}       
             
                ${data.hideGameStores ? generateButton({
                  component: this,
                  id: GAME_STORES_ID,
                  text: "Game Stores",
                }): ``}  
             
                ${data.hideRestaurants ? generateButton({
                  component: this,
                  id: GAME_RESTAURANTS_ID,
                  text: "Bars and Cafés",

                }): ``} 
              </div>
            
            </div>
             
          </div>
        </nav>
      </div>
    
   
      <div class="section-separator-medium"></div>

      <div data-container="root">
        <event-search-component id="event-search-component" class="page-section" isVisible=${!data.hideEvents}>
        </event-search-component>
    
        <div class="section-separator-medium"></div>
    
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
