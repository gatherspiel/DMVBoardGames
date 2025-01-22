import { Component } from "../../../framework/Component.js";

export class GameRestaurantComponent extends Component {
  constructor(parentNodeName, data) {
    super(parentNodeName, data);
  }

  getRestaurantHtml(gameRestaurant) {
    return `
    <div id = convention-${gameRestaurant.id}>
     <h3>
        <a href=${gameRestaurant.link}>${gameRestaurant.name}</a>
      </h3>
    <p>Location: ${gameRestaurant.location}</p>
    </div>
  `;
  }

  generateHtml(gameRestaurants) {
    let html = `<h1> Board Game Bars and Cafés</h1>`;

    Object.values(gameRestaurants).forEach((gameRestaurant) => {
      gameRestaurants["game-store-" + gameRestaurant.id] = {
        gameStore: gameRestaurant,
        frontendState: {},
      };

      html += this.getRestaurantHtml(gameRestaurant);
    });
    return html;
  }

  static createComponent(parentNodeName, data) {
    return new GameRestaurantComponent(parentNodeName, data);
  }
}
