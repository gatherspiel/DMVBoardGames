import { BaseDynamicComponent } from "@bponnaluri/places-js";
import {GAME_RESTAURANT_STORE} from "../../data/list/LocationsStore.ts";
import {generateLinkButton} from "../../shared/html/ButtonGenerator.ts";

export class GameRestaurantListComponent extends BaseDynamicComponent {
  constructor() {
    super([{
      dataStore: GAME_RESTAURANT_STORE,
    }]);
  }

  override getTemplateStyle(): string {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/> 
      <style>
        h1,h2 {
          margin-top:0.5rem;
          padding-left:1.5rem;
        }
        h3 {
          display: inline-block;
        }          
        p {
          font-size: 1rem;
        }
        ul {
          list-style:url(/assets/images/meeple_small.png);
          margin-top:0;
          padding-left:1.5rem;
        }
       .game-resturant-list-item * {
          display: inline-block;
        }
      </style>
    `;
  }

  getItemHtml(gameRestaurant: any) {
    return `
      <li class="game-resturant-list-item">
        <h3>
          ${generateLinkButton({
            text: gameRestaurant.name,
            url: gameRestaurant.url
          })}
        </h3>
        <p>Location: ${gameRestaurant.location}</p>
      </li>
      <div class="section-separator-small"></div>
    `;
  }

  render(data: any) {

    let html = `
      <h1>Board Game Bars and Cafés</h1>
      <div class="section-separator-small"></div>

      <ul>
    `;
    Object.values(data).forEach((item:any) => {
      html += this.getItemHtml(item);
    });

    return html + `</ul></div>`;
  }
}