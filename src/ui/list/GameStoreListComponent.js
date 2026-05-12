import { BaseDynamicComponent } from "@bponnaluri/places-js";
import { GAME_STORE_DATA } from "../../data/list/LocationsStore.js";

export class GameStoreListComponent extends BaseDynamicComponent {
  constructor() {
    super([
      {
        dataStore: GAME_STORE_DATA,
      },
    ]);
  }

  getTemplateStyle() {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/kelp.css"/>

			<link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
        h1 {
          margin-top:1rem;
        }
        p {
          font-size: 1rem;
        }
        ul {
          list-style:url(/assets/images/meeple_small.png);
          margin-top:0;
          padding-left:1.5rem;
        }
        .game-store-list-item * {
          display: inline-block;
					margin-top:0.5em;
					margin-bottom:0.5em;
        }
        @media not screen and (width < 32em) {
          h1 {
            padding-left:1.5rem;
          }
        
        }
      </style> 
    `;
  }

  getItemHtml(gameStore) {
    return `
      <li class="game-store-list-item">
				<a class="btn secondary" href=${gameStore.url}">
					${gameStore.url}
				</a>
        <p>Location: ${gameStore.location}</p>
      </li>
    `;
  }

  render(data) {
    let html = `
      <div class="container-xl ui-section">
				<h1>Game Stores</h1>
				<div class="section-separator-small"></div>
				<ul>
    `;
    Object.values(data).forEach((item) => {
      html +=
        this.getItemHtml(item) +
        `      <div class="section-separator-small"></div>`;
    });
    return (
      html +
      `</ul></div>
    `
    );
  }
}
