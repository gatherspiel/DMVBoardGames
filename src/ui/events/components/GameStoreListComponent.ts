import type { GameStore } from "../data/types/GameStore.ts";
import { BaseDynamicComponent } from "../../../framework/components/BaseDynamicComponent.ts";
import { LOCATIONS_REDUCER } from "../data/search/LocationsReducer.ts";

export const GAME_STORE_LIST_STORE = "gameStoreListStore";

const loadConfig = {
  reducerSubscriptions: [
    {
      reducer: LOCATIONS_REDUCER,
      reducerFunction: (data: any) => {
        return data.gameStores;
      },
    },
  ],
};

export class GameStoreListComponent extends BaseDynamicComponent {
  constructor() {
    super(GAME_STORE_LIST_STORE, loadConfig);
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

  render(data: Record<any, GameStore>) {
    let html = `<h1>Game Stores</h1>`;
    Object.values(data).forEach((item) => {
      const itemHtml = this.getItemHtml(item);
      html += itemHtml;
    });
    return html;
  }
}

if (!customElements.get("game-store-list-component")) {
  customElements.define("game-store-list-component", GameStoreListComponent);
}
