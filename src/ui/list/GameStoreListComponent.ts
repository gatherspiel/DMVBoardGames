import { BaseDynamicComponent } from "@bponnaluri/places-js";
import {generateLinkButton} from "../shared/ButtonGenerator.ts";
import {GAME_STORE_DATA} from "../../data/list/LocationsStore.ts";

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
