import type { GameStore } from "../data/types/GameStore.ts";
import { LOCATIONS_THUNK } from "../data/search/LocationsThunk.ts";
import { BaseTemplateDynamicComponent } from "../../../framework/components/BaseTemplateDynamicComponent.ts";

export const GAME_STORE_LIST_STORE = "gameStoreListStore";

const loadConfig = {
  thunkReducers: [
    {
      thunk: LOCATIONS_THUNK,
      componentStoreReducer: (data: any) => {
        return data.gameStores;
      },
    },
  ],
};

const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>


<style>

  .game-store-list-item p {
    display: inline;
  }
  
    .game-store-list-item > * {
    display: inline-block;
  }
</style>
`;
export class GameStoreListComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super(GAME_STORE_LIST_STORE, loadConfig);
  }

  override getTemplateStyle(): string {
    return template;
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
    let html = `<div class="ui-section"><h1>Game Stores</h1>`;
    Object.values(data).forEach((item) => {
      const itemHtml = this.getItemHtml(item);
      html += itemHtml;
    });
    return html + "</div>";
  }
}

if (!customElements.get("game-store-list-component")) {
  customElements.define("game-store-list-component", GameStoreListComponent);
}
