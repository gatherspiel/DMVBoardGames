import { createComponentState } from "../../../framework/state/ComponentStateManager.ts";
import type { GameStore } from "../data/types/GameStore.ts";

export const GAME_STORE_LIST_STATE = "gameStoreListState";

export class GameStoreListComponent extends HTMLElement {
  constructor() {
    super();
    createComponentState(GAME_STORE_LIST_STATE, this);
  }

  getItemHtml(gameStore: GameStore) {
    return `
    <div id = convention-${gameStore.id} class="game-store-list-item">
     <h3>
        <a href=${gameStore.url}>${gameStore.name}</a>
      </h3>
    <p>Location: ${gameStore.location}</p>
    </div>
  `;
  }

  generateHtml(data: Record<any, GameStore>) {
    let html = `<h1>Game Stores</h1>`;
    Object.values(data).forEach((item) => {
      const itemHtml = this.getItemHtml(item);
      html += itemHtml;
    });
    return html;
  }

  updateData(data: Record<any, GameStore>) {
    const html = this.generateHtml(data);
    this.innerHTML = html;
  }
}

if (!customElements.get("game-store-list-component")) {
  customElements.define("game-store-list-component", GameStoreListComponent);
}
