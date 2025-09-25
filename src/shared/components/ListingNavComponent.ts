import {BaseTemplateComponent} from "@bponnaluri/places-js";
import {generateLinkButton} from "./ButtonGenerator.ts";

const CONVENTIONS_LIST_URL="conventions.html";
const EVENT_LIST_URL="index.html";
const GAME_RESTAURANTS_LIST_URL="gameRestaurants.html";
const GAME_STORE_LIST_URL="gameStores.html";

export class ListingNavComponent extends BaseTemplateComponent {

  constructor() {
    super();
  }

  override getTemplateStyle(): string {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
      
       #show-info-ui {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          padding-left: 1rem;
        }
        #show-more-info {
          color: var(--clr-dark-blue);
          font-size: 1.5rem;
          padding-left:1rem;
        }
        .raised {
          display: inline-block;
        }
        @media screen and (width < 32em) {
          .raised {
            margin-top:0.5rem;
          }
        }
      </style>
    `;
  }

  override render(): string {
    return `
      <span id="show-more-info">Click for more info about:</span>
      <div id ="show-info-ui">
        ${this.getAttribute("currentPage") != CONVENTIONS_LIST_URL ? generateLinkButton({
          text: "Conventions",
          url: CONVENTIONS_LIST_URL
        }): ``} 
        
        ${this.getAttribute("currentPage") != GAME_RESTAURANTS_LIST_URL ? generateLinkButton({
          text: "Game Restaurants",
          url: GAME_RESTAURANTS_LIST_URL
        }): ``}

        ${this.getAttribute("currentPage") != GAME_STORE_LIST_URL ? generateLinkButton({
          text: "Game Stores",
          url: GAME_STORE_LIST_URL
        }): ``}

        ${this.getAttribute("currentPage") != EVENT_LIST_URL ? generateLinkButton({
          text: "Groups",
          url: EVENT_LIST_URL
        }): ``}     
        
        ${generateLinkButton({
          text: "Source code",
          url: "https://github.com/gatherspiel"
        })}   
 
        ${generateLinkButton({
          text: "Future plans",
          url: "https://gatherspiel.com/vision.html"
        })}    
               
      </div>`
  }
}