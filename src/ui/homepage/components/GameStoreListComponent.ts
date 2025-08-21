import type { GameStore } from "../data/types/GameStore.ts";
import { BaseTemplateDynamicComponent } from "@bponnaluri/places-js";
import {generateButton} from "../../../shared/components/ButtonGenerator.ts";
import {REDIRECT_HANDLER_CONFIG} from "@bponnaluri/places-js";
import {
  GLOBAL_STATE_LOAD_CONFIG_KEY,
} from "@bponnaluri/places-js";
import {EVENT_HANDLER_CONFIG_KEY, EVENT_HANDLER_PARAMS_KEY} from "../../../shared/Constants.ts";

const loadConfig = {
  [GLOBAL_STATE_LOAD_CONFIG_KEY]: {
    globalFieldSubscriptions: ["gameLocations"],
    defaultGlobalStateReducer: (data:any)=>{
      return data.gameLocations.gameStores;
    }
  },
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
    super(loadConfig);
  }

  override getTemplateStyle(): string {
    return template;
  }

  getItemHtml(gameStore: GameStore) {
    return `
    <div id = convention-${gameStore.id} class="game-store-list-item">
     <h3>
        ${generateButton({
          text: `${gameStore.name}`,
          component: this,
          [EVENT_HANDLER_CONFIG_KEY]: REDIRECT_HANDLER_CONFIG,
          [EVENT_HANDLER_PARAMS_KEY]: {url: gameStore.url}
        })}
      </h3>
    <p>Location: ${gameStore.location}</p>
    </div>
  `;
  }

  render(data: Record<any, GameStore>) {
    let html = `<div class="ui-section"><h1 class="hideOnMobile">Game Stores</h1>
    <h2 class="showOnMobile">Game stores</h2>`;
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
