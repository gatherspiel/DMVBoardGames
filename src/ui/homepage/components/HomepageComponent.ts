/*
  These imports are to load the Web Components that will be displayed.
 */

import {generateButton} from "../../../shared/components/ButtonGenerator.ts";

import {BaseDynamicComponent} from "@bponnaluri/places-js";


import {LoginStatusComponent} from "../../../shared/components/LoginStatusComponent.js";
import {GroupListComponent} from "./GroupListComponent.ts";
import {GameStoreListComponent} from "./GameStoreListComponent.js";
import {GameRestaurantListComponent} from "./GameRestaurantListComponent.js";
import {ConventionListComponent} from "./ConventionListComponent.js";
import {GroupSearchComponent} from "./group-search/GroupSearchComponent.js";
import {OpenCreateGroupPageComponent} from "./OpenCreateGroupPageComponent.js";

customElements.define("open-create-group-component", OpenCreateGroupPageComponent);
customElements.define("login-status-component",LoginStatusComponent)
customElements.define("group-list-component", GroupListComponent);
customElements.define("game-store-list-component", GameStoreListComponent);
customElements.define("convention-list-component", ConventionListComponent);
customElements.define(
  "game-restaurant-list-component",
  GameRestaurantListComponent,
);
customElements.define("group-search-component", GroupSearchComponent);


const CONVENTIONS_ID = "convention-list";
const EVENT_SEARCH_ID ="group-search";
const GAME_RESTAURANTS_ID="game-restaurants";
const GAME_STORES_ID="game-stores";

export class HomepageComponent extends BaseDynamicComponent {
  constructor(){
    super();
  }

  override attachEventHandlersToDom(shadowRoot?:any){

    const self = this;

    shadowRoot?.getElementById('show-info-ui')?.addEventListener("click",(event:any)=>{
      event.preventDefault();

      const targetId = event.target.id;
      if ([CONVENTIONS_ID, EVENT_SEARCH_ID, GAME_RESTAURANTS_ID, GAME_STORES_ID].includes(targetId)) {
        self.updateData({
          hideEvents: targetId !== EVENT_SEARCH_ID,
          hideConventions: targetId !== CONVENTIONS_ID,
          hideRestaurants: targetId !== GAME_RESTAURANTS_ID,
          hideGameStores: targetId !== GAME_STORES_ID
        })
      }
    })

  }

  connectedCallback() {
    this.updateData({
      hideEvents: false,
      hideConventions: true,
      hideRestaurants: true,
      hideGameStores: true
    });
  }

  override getTemplateStyle():string{
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>

      <style>
        .section-separator-medium {
          border-bottom:  20px solid;
          border-image-source: url(assets/Section_Border_Medium.png);
          border-image-slice: 20 20;
          border-image-repeat: round;
        }
        
        .section-separator-small {
          border-bottom:  5px solid;
          border-image-source: url(assets/Section_Border_Tiny.png);
          border-image-slice: 5 5;
          border-image-repeat: round;
          padding-bottom: 0.5rem;
        }
       
        #show-info-ui {
          padding-bottom: 0.5rem;
        }
        
        #nav-container {
          padding-bottom: 0.25rem;
        }
        
        #show-more-info {
         font-size: 1.5rem;
         font-weight: 600;       
       }

       @media screen and (width < 32em) {
          .raised {
            margin-top:0.5rem;
          }
        }
      
    </style>
    `
  }


  render(data:any){
    return `
      <open-create-group-component class = "ui-section">
      </open-create-group-component>     
      
      <div class="section-separator-small"></div>

      <div class = "ui-section">
        <span id="show-more-info">Click for more info about:</span>
      </div>
      
      <div class = "ui-section">
        <div id="show-info-ui">
          ${data.hideEvents || data.showAllButtons ? generateButton({
            id: EVENT_SEARCH_ID,
            text: "Events",
          }): ``} 
            
          ${data.hideConventions ? generateButton({
            id: CONVENTIONS_ID,
            text: "Conventions",
          }): ``}       
       
          ${data.hideGameStores ? generateButton({
            id: GAME_STORES_ID,
            text: "Game Stores",
          }): ``}  
       
          ${data.hideRestaurants ? generateButton({
            id: GAME_RESTAURANTS_ID,
            text: "Bars and Cafés",
          }): ``} 
        </div>
      </div>

      <div class="section-separator-medium"></div>
      
      <group-search-component class = "ui-section" id="group-search-component" isVisible=${!data.hideEvents}>
      </group-search-component>
      
      <div class="section-separator-medium"></div>

      ${data && !data.hideEvents ? `
          <group-list-component class="ui-section"></group-list-component>
        `: ''}
      <div class = "ui-section">
      
    

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

