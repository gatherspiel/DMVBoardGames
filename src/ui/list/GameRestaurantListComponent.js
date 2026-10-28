import { GAME_RESTAURANT_STORE } from "../../data/list/LocationsStore.js";
import { PresentationComponent } from "/lib/places-js-old.js";

export class GameRestaurantListComponent extends PresentationComponent {
  constructor() {
    super([
      {
        dataStore: GAME_RESTAURANT_STORE,
      },
    ]);
  }

  getItemHtml(gameRestaurant) {
    return `
    
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
