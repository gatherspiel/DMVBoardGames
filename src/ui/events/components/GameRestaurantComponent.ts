import { createComponentStore } from "../../../framework/store/ComponentStore.ts";
import type { GameRestaurant } from "../data/types/GameRestaurant.ts";
import { BaseDynamicComponent } from "../../../framework/components/BaseDynamicComponent.ts";

export const GAME_RESTAURANT_LIST_STORE = "gameRestaurantListStore";
export class GameRestaurantComponent extends BaseDynamicComponent {
  constructor() {
    super();
    createComponentStore(GAME_RESTAURANT_LIST_STORE, this);
  }

  getItemHtml(gameRestaurant: GameRestaurant) {
    return `
    <div id = convention-${gameRestaurant.id} class="game-restaurant-list-item">
     <h3>
        <a href=${gameRestaurant.url}>${gameRestaurant.name}</a>
      </h3>
    <p>Location: ${gameRestaurant.location}</p>
    </div>
  `;
  }

  render(data: Record<any, GameRestaurant>) {
    let html = `<h1>Board Game Bars and Cafés</h1>`;
    Object.values(data).forEach((item) => {
      const itemHtml = this.getItemHtml(item);
      html += itemHtml;
    });
    return html;
  }
}

if (!customElements.get("game-restaurant-list-component")) {
  customElements.define(
    "game-restaurant-list-component",
    GameRestaurantComponent,
  );
}
