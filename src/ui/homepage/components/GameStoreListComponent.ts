import { BaseDynamicComponent } from "@bponnaluri/places-js";
import {generateLinkButton} from "../../../shared/components/ButtonGenerator.ts";
import {LOCATIONS_STORE} from "../data/search/LocationsStore.ts";

const loadConfig = [{
      componentReducer: (data:any)=>{
        return data.gameStores;
      },
      dataStore: LOCATIONS_STORE,
    }]


const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>
  <style>

  
  .game-store-list-item * {
    display: inline-block;
  }
  
  .section-separator-small {
    border-bottom:  5px solid;
    border-image-source: url(assets/Section_Border_Tiny.png);
    border-image-slice: 5 5;
    border-image-repeat: round;
    padding-bottom: 0.5rem;
  }
  
  p {
      font-size: 1rem;
    }
  </style>
`;
export class GameStoreListComponent extends BaseDynamicComponent {
  constructor() {
    super(loadConfig);
  }

  override getTemplateStyle(): string {
    return template;
  }

  getItemHtml(gameStore: any) {
    return `
    <div id = convention-${gameStore.id} class="game-store-list-item section-separator-small">
     <h3>
        ${generateLinkButton({
          text: gameStore.name,
          url: gameStore.url
        })}
      </h3>
    <p>Location: ${gameStore.location}</p>
    </div>
  `;
  }

  render(data: any) {
    let html = `<div class="ui-section"><h1 class="hideOnMobile">Game Stores</h1>
    <h2 class="showOnMobile">Game stores</h2>
    <div class="section-separator-small"></div>
    `;
    Object.values(data).forEach((item) => {
      const itemHtml = this.getItemHtml(item);
      html += itemHtml;
    });
    return html + "</div>";
  }
}
