import { BaseDynamicComponent } from "@bponnaluri/places-js";
import {generateLinkButton} from "../../../shared/components/ButtonGenerator.ts";
import {LOCATIONS_STORE} from "../data/search/LocationsStore.ts";

import {ListingNavComponent} from "../../../shared/components/ListingNavComponent.ts";
customElements.define("listing-nav-component", ListingNavComponent);

export class GameStoreListComponent extends BaseDynamicComponent {
  constructor() {
    super([{
      componentReducer: (data:any)=>{
        return data.gameStores;
      },
      dataStore: LOCATIONS_STORE,
    }]);
  }

  override getTemplateStyle(): string {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
      .game-store-list-item * {
        display: inline-block;
      }
      p {
        font-size: 1rem;
      }
      </style> 
    `;
  }

  getItemHtml(gameStore: any) {
    return `
      <div class="game-store-list-item">
        <h3>
          ${generateLinkButton({
            text: gameStore.name,
            url: gameStore.url
          })}
        </h3>
        <p>Location: ${gameStore.location}</p>
      </div>
      <div class="section-separator-small"></div>
    `;
  }

  render(data: any) {

    let html = `
      <listing-nav-component
        class="ui-section"
        id="show-info-ui"
        currentPage="gameStores.html"
      >  
      </listing-nav-component>
      <div class="ui-section">
      <h1 class="hide-mobile">Game Stores</h1>
      <h2 class="show-mobile">Game stores</h2>
      <div class="section-separator-medium"></div>
    `;
    Object.values(data).forEach((item) => {
      html += this.getItemHtml(item);
    });
    return html + "</div>";
  }
}
