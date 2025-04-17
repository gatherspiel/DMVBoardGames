import {
  createComponentState,
  createState,
  subscribeToState,
} from "../../../framework/State/StateManager.js";

export const GAME_STORE_LIST_STATE = "gameStoreListState";

export class GameStoreListComponent extends HTMLElement {
  constructor() {
    super();
    createComponentState(GAME_STORE_LIST_STATE, this);
  }

  getItemHtml(gameStore) {
    return `
    <div id = convention-${gameStore.id} class="game-store-list-item">
     <h3>
        <a href=${gameStore.link}>${gameStore.name}</a>
      </h3>
    <p>Location: ${gameStore.location}</p>
    </div>
  `;
  }

  generateHtml(data) {
    let html = `<h1>Game Stores</h1>`;
    Object.values(data).forEach((item) => {
      const itemHtml = this.getItemHtml(item);
      html += itemHtml;
    });
    return html;
  }

  updateData(data) {
    const html = this.generateHtml(data);
    this.innerHTML = html;
  }
}

if (!customElements.get("game-store-list-component")) {
  customElements.define("game-store-list-component", GameStoreListComponent);
}
