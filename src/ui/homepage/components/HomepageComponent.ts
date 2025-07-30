/*
  These imports are to load the Web Components that will be displayed.
 */

// @ts-ignore
import {GameRestaurantComponent} from "./GameRestaurantComponent.ts";
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

const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>
  `


export class HomepageComponent extends BaseTemplateDynamicComponent {

  isFromBackButton: boolean | undefined;

  constructor(isFromBackButton?:boolean){
    super("homepage-component");
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
     <div class="ui-separator"></div>
      <div class="ui-section">
    
        <create-group-component>
        
        </create-group-component>
        <nav>
          <div id="nav-container">
            <div>Click for more info about</div>
            
    
              
            ${generateButton({
              text: "Conventions",
              component: this,
              eventHandlerConfig: HOMEPAGE_COMPONENT_NAV,
              eventHandlerParams: {location:"#convention-list"}
            })}       
         
            ${generateButton({
              text: "Game Stores",
              component: this,
              eventHandlerConfig: HOMEPAGE_COMPONENT_NAV,
              eventHandlerParams: {location:"#game-store"}
            })}  
         
            ${generateButton({
              text: "Bars and Cafés",
              component: this,
              eventHandlerConfig: HOMEPAGE_COMPONENT_NAV,
              eventHandlerParams: {location:"#game-store"}
            })} 
             
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
    
      ${data && !data.hideStores ? `
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