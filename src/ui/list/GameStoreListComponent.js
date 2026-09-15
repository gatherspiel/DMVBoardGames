import { GAME_STORE_DATA } from "../../data/list/LocationsStore.js";
import { PresentationComponent } from "/lib/places-js-latest.js";

export class GameStoreListComponent extends PresentationComponent {
  constructor() {
    super([
      {
        dataStore: GAME_STORE_DATA,
      },
    ]);
  }

  getItemHtml(gameStore) {
    return `
      <li class="game-store-list-item">
        <a class="btn secondary" href=${gameStore.url}">
          ${gameStore.name}
        </a>
        <p>Location: ${gameStore.location}</p>
      </li>
    `;
  }

  render(data) {
    let html = `
      <div class="container-xl ui-section">
        <h1>Game Stores</h1>
        <div class="section-separator-small"></div>
        <ul>
    `;
    Object.values(data).forEach((item) => {
      html +=
        this.getItemHtml(item) + `<div class="section-separator-small"></div>`;
    });
    return html + `</ul></div>`;
  }
}
