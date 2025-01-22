import { Component } from "../../../framework/Component.js";

export class GameStoreComponent extends Component {
  constructor(parentNodeName, data) {
    super(parentNodeName, data);
  }

  getGameStoreHtml(gameStore) {
    return `
    <div id = convention-${gameStore.id}>
     <h3>
        <a href=${gameStore.link}>${gameStore.name}</a>
      </h3>
    <p>Location: ${gameStore.location}</p>
    </div>
  `;
  }

  generateHtml(gameStores) {
    let html = `<h1> Game Stores</h1>`;

    Object.values(gameStores).forEach((gameStore) => {
      gameStores["game-store-" + gameStore.id] = {
        gameStore: gameStore,
        frontendState: {},
      };

      const gameStoreHtml = this.getGameStoreHtml(gameStore);
      html += gameStoreHtml;
    });
    return html;
  }

  static createComponent(parentNodeName, data) {
    return new GameStoreComponent(parentNodeName, data);
  }
}
