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
import {BaseTemplateDynamicComponent} from "../../../framework/components/BaseTemplateDynamicComponent.ts";
import {generateButton} from "../../../shared/components/ButtonGenerator.ts";
import {DEFAULT_COMPONENT_STATE_KEY} from "../../../framework/components/types/ComponentLoadConfig.ts";
import {EVENT_HANDLER_CONFIG_KEY, EVENT_HANDLER_PARAMS_KEY} from "../../../shared/Constants.ts";

const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>

  `

const loadConfig = {
  [DEFAULT_COMPONENT_STATE_KEY]: {
    hideEvents: false,
    hideConventions: true,
    hideRestaurants: true,
    hideGameStores: true,
  }
}
export class HomepageComponent extends BaseTemplateDynamicComponent {

  isFromBackButton: boolean | undefined;

  constructor(isFromBackButton?:boolean){
    super("homepage-component",loadConfig);
    this.isFromBackButton = isFromBackButton;
  }
  override getTemplateStyle(): string {
    return template;
  }
  connectedCallback(){
    this.updateStore({});
  }
  render(data:any){
    return `
        <div class="ui-section">
        <create-group-component>
        </create-group-component>
        <nav>
          <div id="nav-container">
            <div>Click for more info about</div>
            
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

/*
TODO: Possible optimization idea that also simplifies the code.
-Initialize the search UI with just html

-Create a script.js file. It can contain utility fuctions to create events
 */