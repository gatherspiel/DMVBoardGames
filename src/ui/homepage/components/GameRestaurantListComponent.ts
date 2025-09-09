import { BaseDynamicComponent } from "@bponnaluri/places-js";
import {generateLinkButton} from "../../../shared/components/ButtonGenerator.ts";
import {LOCATIONS_STORE} from "../data/search/LocationsStore.ts";


import {ListingNavComponent} from "../../../shared/components/ListingNavComponent.ts";
customElements.define("listing-nav-component", ListingNavComponent);
const loadConfig = [{
      componentReducer: (data:any)=>{
        return data.gameRestaurants;
      },
      dataStore: LOCATIONS_STORE,
    }]


const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>

  <style>
 
    
    h3 {
      display: inline-block;
    }
    
    .section-separator-small {
      border-bottom:  5px solid;
      border-image-source: url(assets/Section_Border_Tiny.png);
      border-image-slice: 5 5;
      border-image-repeat: round;
    }
        
    p {
      font-size: 1rem;
    }
  </style>
`;
export class GameRestaurantListComponent extends BaseDynamicComponent {
  constructor() {
    super(loadConfig);
  }

  override getTemplateStyle(): string {
    return template;
  }

  getItemHtml(gameRestaurant: any) {
    return `
    <div id = convention-${gameRestaurant.id} class="section-separator-small ">
     <h3>
        ${generateLinkButton({
          text: gameRestaurant.name,
          url: gameRestaurant.url
        })}
      </h3>
    <p>Location: ${gameRestaurant.location}</p>
    </div>
  `;
  }

  render(data: any) {

    let html = `
      <listing-nav-component
        class="ui-section"
        id="show-info-ui"
        currentPage="gameRestaurants.html"
      >
      </listing-nav-component>
      <div class="game-restaurants">
      <h1 class="hideOnMobile">Board Game Bars and Cafés</h1>
      <h2 class="showOnMobile">Board Game Bars and Cafés</h2>
      <div class="section-separator-small"></div>

    `;
    Object.values(data).forEach((item:any) => {
      const itemHtml = this.getItemHtml(item);
      html += itemHtml;
    });

    return html + `</div>`;
  }
}