import { BaseDynamicComponent } from "@bponnaluri/places-js";
import {generateLinkButton} from "../../../shared/components/ButtonGenerator.ts";
import {GAME_RESTAURANT_STORE} from "../data/search/LocationsStore.ts";

import {ListingNavComponent} from "../../../shared/components/ListingNavComponent.ts";
customElements.define("listing-nav-component", ListingNavComponent);

export class GameRestaurantListComponent extends BaseDynamicComponent {
  constructor() {
    super([{
      componentReducer: (data:any)=>{
        return data;
      },
      dataStore: GAME_RESTAURANT_STORE,
    }]);
  }

  override getTemplateStyle(): string {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/> 
      <style>
        h3 {
          display: inline-block;
        }          
        p {
          font-size: 1rem;
        }
      </style>
    `;
  }

  getItemHtml(gameRestaurant: any) {
    return `
      <div>
        <h3>
          ${generateLinkButton({
            text: gameRestaurant.name,
            url: gameRestaurant.url
          })}
        </h3>
        <p>Location: ${gameRestaurant.location}</p>
        <div class="section-separator-small"></div>
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
      <h1 class="hide-mobile">Board Game Bars and Cafés</h1>
      <h2 class="show-mobile">Board Game Bars and Cafés</h2>
      <div class="section-separator-medium"></div>

    `;
    Object.values(data).forEach((item:any) => {
      html += this.getItemHtml(item);
    });

    return html + `</div>`;
  }
}