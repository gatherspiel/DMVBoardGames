import { BaseDynamicComponent } from "/lib/places-js-latest.js";
import { GAME_RESTAURANT_STORE } from "../../data/list/LocationsStore.js";

export class GameRestaurantListComponent extends BaseDynamicComponent {
  constructor() {
    super([
      {
        dataStore: GAME_RESTAURANT_STORE,
      },
    ]);
  }

  getItemHtml(gameRestaurant) {
    return `
      <li class="game-resturant-list-item">
        <a class="btn secondary" href=${gameRestaurant.url}>
          ${gameRestaurant.name}
        </a> 
        <p>Location: ${gameRestaurant.location}</p>
      </li>
      <div class="section-separator-small"></div>
    `;
  }

  render(data) {
    let html = `
      <div class="container-xl"> 
        <h1>Board Game Bars and Cafés</h1>
        <div class="section-separator-small"></div>
        <ul>
    `;
    Object.values(data).forEach((item) => {
      html += this.getItemHtml(item);
    });

    return html + `</ul></div>`;
  }
}
