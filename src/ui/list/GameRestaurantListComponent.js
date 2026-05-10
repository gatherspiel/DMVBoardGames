import { BaseDynamicComponent } from "@bponnaluri/places-js";
import { GAME_RESTAURANT_STORE } from "../../data/list/LocationsStore.js";

export class GameRestaurantListComponent extends BaseDynamicComponent {
  constructor() {
    super([
      {
        dataStore: GAME_RESTAURANT_STORE,
      },
    ]);
  }

  getTemplateStyle() {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/> 
      <link rel="stylesheet" type="text/css" href="/styles/kelp.css"/> 

			<style>  
        ul {
          list-style:url(/assets/images/meeple_small.png);
          margin-top:0;
          padding-left:1.5rem;
        }
       .game-resturant-list-item * {
					margin-top:0.5em;
					margin-bottom:0.5em;
					display: inline-block;
        }
      </style>
    `;
  }

  getItemHtml(gameRestaurant) {
    return `
      <li class="game-resturant-list-item">
        <a class="btn secondary" href=${gameRestaurant.url}>
					${gameRestaurant.name}
        </a> 
        <p>Location: ${gameRestaurant.location}</p>
      </li>
      <div class="section-separator-small"></div>
    `;
  }

  render(data) {
    let html = `
			<div class="container-xl"> 
				<h1>Board Game Bars and Cafés</h1>
				<div class="section-separator-small"></div>

				<ul>
    `;
    Object.values(data).forEach((item) => {
      html += this.getItemHtml(item);
    });

    return html + `</ul></div>`;
  }
}
