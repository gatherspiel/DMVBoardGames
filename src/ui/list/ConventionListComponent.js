import { BaseDynamicComponent } from "/lib/places-js-latest.js";
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
      `</ul></div>`
    );
  }
}
