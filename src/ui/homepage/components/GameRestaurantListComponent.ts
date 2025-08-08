import type { GameRestaurant } from "../data/types/GameRestaurant.ts";
import { BaseTemplateDynamicComponent } from "../../../framework/components/BaseTemplateDynamicComponent.ts";
import {generateButton} from "../../../shared/components/ButtonGenerator.ts";
import {REDIRECT_HANDLER_CONFIG} from "../../../framework/handler/RedirectHandler.ts";

export const GAME_RESTAURANT_LIST_STORE = "gameRestaurantListStore";

const loadConfig = {
  globalStateLoadConfig: {
    globalFieldSubscriptions: ["gameLocations"],
    defaultGlobalStateReducer: function(data:any){
      return data.gameLocations.gameRestaurants;
    }
  },
};

const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>

  <style>
    .game-restaurant-list-item > * {
      display: inline-block;
    }
  </style>
`;
export class GameRestaurantListComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super(GAME_RESTAURANT_LIST_STORE, loadConfig);
  }

  override getTemplateStyle(): string {
    return template;
  }

  getItemHtml(gameRestaurant: GameRestaurant) {
    return `
    <div id = convention-${gameRestaurant.id} class="game-restaurant-list-item">
     <h3>
        ${generateButton({
          text: `${gameRestaurant.name}`,
          component: this,
          eventHandlerConfig: REDIRECT_HANDLER_CONFIG,
          eventHandlerParams: {url: gameRestaurant.url}
        })}
      </h3>
    <p>Location: ${gameRestaurant.location}</p>
    </div>
  `;
  }

  render(data: Record<any, GameRestaurant>) {

    let html = `<div class ="ui-section">
    <h1 class="hideOnMobile">Board Game Bars and Cafés</h1>
    <h2 class="showOnMobile">Board Game Bars and Cafés</h2>
    `;
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
    GameRestaurantListComponent,
  );
}
