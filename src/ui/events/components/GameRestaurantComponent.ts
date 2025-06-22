import type { GameRestaurant } from "../data/types/GameRestaurant.ts";
import { LOCATIONS_THUNK } from "../data/search/LocationsThunk.ts";
import { BaseTemplateDynamicComponent } from "../../../framework/components/BaseTemplateDynamicComponent.ts";
import { getSharedUiSectionStyles } from "../../utils/SharedStyles.ts";

export const GAME_RESTAURANT_LIST_STORE = "gameRestaurantListStore";

const loadConfig = {
  thunkReducers: [
    {
      thunk: LOCATIONS_THUNK,
      componentStoreReducer: (data: any) => {
        return data.gameRestaurants;
      },
    },
  ],
};

const template = `
  <style>
    .game-restaurant-list-item > * {
      display: inline-block;
    }
  </style>
`;
export class GameRestaurantComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super(GAME_RESTAURANT_LIST_STORE, loadConfig);
  }

  override getTemplateStyle(): string {
    return template;
  }

  override getSharedStyle(): string {
    return getSharedUiSectionStyles();
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
    let html = `<div class ="ui-section"><h1>Board Game Bars and Cafés</h1>`;
    Object.values(data).forEach((item) => {
      const itemHtml = this.getItemHtml(item);
      html += itemHtml;
    });
    return html + `</div>`;
  }
}

if (!customElements.get("game-restaurant-list-component")) {
  customElements.define(
    "game-restaurant-list-component",
    GameRestaurantComponent,
  );
}
