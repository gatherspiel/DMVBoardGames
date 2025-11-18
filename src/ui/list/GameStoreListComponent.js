import { BaseDynamicComponent } from "@bponnaluri/places-js";
import {generateLinkButton} from "../../shared/html/ButtonGenerator.js";
import {GAME_STORE_DATA} from "../../data/list/LocationsStore.js";

export class GameStoreListComponent extends BaseDynamicComponent {
  constructor() {
    super([{
      dataStore: GAME_STORE_DATA,
    }]);
  }

  getTemplateStyle() {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
        h1 {
          margin-top:1rem;
        }
        p {
          font-size: 1rem;
        }
        ul {
          list-style:url(/assets/images/meeple_small.png);
          margin-top:0;
          padding-left:1.5rem;
        }
        .game-store-list-item * {
          display: inline-block;
        }
        @media not screen and (width < 32em) {
          h1 {
            padding-left:1.5rem;
          }
        
        }
      </style> 
    `;
  }

  getItemHtml(gameStore) {
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

  render(data) {

    let html = `
      <div class="ui-section">
      <h1>Game Stores</h1>
      <div class="section-separator-small"></div>
      <ul>
    `;
    Object.values(data).forEach((item) => {
      html += this.getItemHtml(item) + `      <div class="section-separator-small"></div>`;
    });
    return html + `</ul></div>
    `;
  }
}
