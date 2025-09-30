import { BaseDynamicComponent } from "@bponnaluri/places-js";
import {generateLinkButton} from "../../../shared/components/ButtonGenerator.ts";
import {GAME_STORE_DATA} from "../data/search/LocationsStore.ts";

import {ListingNavComponent} from "../../../shared/components/ListingNavComponent.ts";
customElements.define("listing-nav-component", ListingNavComponent);

export class GameStoreListComponent extends BaseDynamicComponent {
  constructor() {
    super([{
      componentReducer: (data:any)=>{
        return data;
      },
      dataStore: GAME_STORE_DATA,
    }]);
  }

  override getTemplateStyle(): string {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
        h1,h2 {
          padding-left:1.5rem;
        }
        p {
          font-size: 1rem;
        }
        ul {
          list-style:url(/assets/meeple_small.png);
          margin-top:0;
          padding-left:1.5rem;
        }
        .game-store-list-item * {
          display: inline-block;
        }
      </style> 
    `;
  }

  getItemHtml(gameStore: any) {
    return `
      <li class="game-store-list-item">
        <h3>
          ${generateLinkButton({
            text: gameStore.name,
            url: gameStore.url
          })}
        </h3>
        <p>Location: ${gameStore.location}</p>
      </li>
    `;
  }

  render(data: any) {

    let html = `
      <div class="ui-section">
      <h1 class="hide-mobile">Game Stores</h1>
      <h2 class="show-mobile">Game stores</h2>
      <div class="section-separator-medium"></div>
      <ul>
    `;
    Object.values(data).forEach((item) => {
      html += this.getItemHtml(item) + `      <div class="section-separator-small"></div>`;
    });
    return html + `</ul></div>
      <listing-nav-component
        class="ui-section"
        id="show-info-ui"
        currentPage="gameStores.html"
      >
      </listing-nav-component>  
    `;
  }
}
