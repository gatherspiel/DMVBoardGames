import { BaseDynamicComponent } from "@bponnaluri/places-js";
import { generateLinkButton} from "../../../shared/components/ButtonGenerator.ts";

import {CONVENTIONS_STORE} from "../data/search/LocationsStore.ts";

import {ListingNavComponent} from "../../../shared/components/ListingNavComponent.ts";
import {convertDateListToRange} from "../../../shared/EventDataUtils.ts";
customElements.define("listing-nav-component", ListingNavComponent);

export class ConventionListComponent extends BaseDynamicComponent {
  constructor() {
    super([{
      componentReducer: (data:any)=>{
        return data;
      },
      dataStore: CONVENTIONS_STORE,
    }]);
  }

  override getTemplateStyle(): string {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
        .conv-list-item > * {
          display: inline-block;
          font-size: 1.5rem;
          font-weight: 600;
        }  
        h3 {
          font-size: 1.5rem;
        }
        .date-info {
          padding-left: 0.5rem;
        }
      </style>
    `;
  }

  getItemHtml(convention: any) {
    return `
    <div class="conv-list-item">
     <h3>
      ${generateLinkButton({
      text: convention.name,
      url: convention.url
    })}
      </h3>
      <span class="date-info">${convertDateListToRange(convention.days)}</span>
    </div>
    <div class="section-separator-small"></div>
  `;
  }

  render(data: any) {
    let html = `


      <div class="ui-section"><h1 class="hide-mobile">Upcoming conventions</h1>
      <h2 class="show-mobile">Upcoming conventions</h2>
      <div class="section-separator-medium"></div>

    `;

    Object.values(data).forEach((item:any) => {
      html += this.getItemHtml(item);
    });

    if(Object.values(data).length === 0) {
      html+=`<p>No conventions found</p>`;
    }

    return html + `</div>
      <listing-nav-component
        class="ui-section"
        id="show-info-ui"
        currentPage="conventions.html"
      >
      </listing-nav-component>
    `;
  }
}
