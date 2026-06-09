import { BaseDynamicComponent } from "@bponnaluri/places-js";

import { CONVENTIONS_STORE } from "../../data/list/LocationsStore.js";

import { convertDateListToRange } from "../../shared/EventDataUtils.js";

export class ConventionListComponent extends BaseDynamicComponent {
  constructor() {
    super([
      {
        dataStore: CONVENTIONS_STORE,
      },
    ]);
  }

  getTemplateStyle() {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/kelp.css"/>

			<link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style> 
        ul {
          list-style:url(/assets/images/meeple_small.png);
          margin-top:0;
          padding-left:1.5rem;
        }
        .conv-list-item > * {
          display: inline-block;
					margin-bottom:0.5em; 
				}  
        .date-info {
          padding-left: 0.5rem;
        } 
      </style>
    `;
  }

  getItemHtml(convention) {
    return `
    <li class="conv-list-item">
			<a class="btn secondary" href=${convention.name}>${convention.url}</a> 
      <span class="date-info">${convertDateListToRange(convention.days)}</span>
    </li>

  `;
  }

  render(data) {
    let html = `
      <div class="container-xl">
      <h1>Upcoming conventions</h1>
      <ul>
    `;

    Object.values(data).forEach((item) => {
      html +=
        this.getItemHtml(item) + `<div class="section-separator-small"></div>`;
    });

    if (Object.values(data).length === 0) {
      html += `<p>No conventions found</p>`;
    }

    return (
      html +
      `</ul></div>
    `
    );
  }
}
