import { ListComponent } from "./shared/ListComponent.js";

export class GameStoreComponent extends ListComponent {
  constructor(parentNodeName, data) {
    super(parentNodeName, data);
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

  static createComponent(parentNodeName, data) {
    return new GameStoreComponent(parentNodeName, data);
  }
}
