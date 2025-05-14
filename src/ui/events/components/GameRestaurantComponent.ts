import { createComponentState } from "../../../framework/state/ComponentStateManager.ts";
import type { GameRestaurant } from "../data/types/GameRestaurant.ts";

export const GAME_RESTAURANT_STATE = "gameRestaurantListState";
export class GameRestaurantComponent extends HTMLElement {
  constructor() {
    super();
    createComponentState(GAME_RESTAURANT_STATE, this);
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

  generateHtml(data: Record<any, GameRestaurant>) {
    let html = `<h1>Board Game Bars and Cafés</h1>`;
    Object.values(data).forEach((item) => {
      const itemHtml = this.getItemHtml(item);
      html += itemHtml;
    });
    return html;
  }

  updateData(data: Record<any, GameRestaurant>) {
    const html = this.generateHtml(data);
    this.innerHTML = html;
  }
}

if (!customElements.get("game-restaurant-list-component")) {
  customElements.define(
    "game-restaurant-list-component",
    GameRestaurantComponent,
  );
}
