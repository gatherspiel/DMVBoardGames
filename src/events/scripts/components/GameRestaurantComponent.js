import { ListComponent } from "../../../framework/Component/ListComponent.js";

export class GameRestaurantComponent extends ListComponent {
  constructor(parentNodeName, data) {
    super(parentNodeName, data);
  }

  getItemHtml(gameRestaurant) {
    return `
    <div id = convention-${gameRestaurant.id} class="game-restaurant-list-item">
     <h3>
        <a href=${gameRestaurant.link}>${gameRestaurant.name}</a>
      </h3>
    <p>Location: ${gameRestaurant.location}</p>
    </div>
  `;
  }

  static createComponent(parentNodeName, data) {
    return new GameRestaurantComponent(parentNodeName, data);
  }
}
