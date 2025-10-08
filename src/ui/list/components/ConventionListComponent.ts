import { BaseDynamicComponent } from "@bponnaluri/places-js";
import { generateLinkButton} from "../../../shared/html/ButtonGenerator.ts";

import {CONVENTIONS_STORE} from "../data/search/LocationsStore.ts";

import {convertDateListToRange} from "../../../shared/data/EventDataUtils.ts";

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
        h1,h2{
          padding-left:1.5rem;
        }
        h3 {
          font-size: 1.5rem;
        }
        ul {
          list-style:url(/assets/meeple_small.png);
          margin-top:0;
          padding-left:1.5rem;
        }
        .conv-list-item > * {
          display: inline-block;
          font-size: 1.5rem;
          font-weight: 600;
        }  
        .date-info {
          padding-left: 0.5rem;
        }
      </style>
    `;
  }

  getItemHtml(convention: any) {
    return `
    <li class="conv-list-item">
     <h3>
      ${generateLinkButton({
      text: convention.name,
      url: convention.url
    })}
      </h3>
      <span class="date-info">${convertDateListToRange(convention.days)}</span>
    </li>

  `;
  }

  render(data: any) {
    let html = `


      <div class="ui-section"><h1 class="hide-mobile">Upcoming conventions</h1>
      <h2 class="show-mobile">Upcoming conventions</h2>
      <div class="section-separator-medium"></div>
      <ul>
    `;

    Object.values(data).forEach((item:any) => {
      html += this.getItemHtml(item) +`<div class="section-separator-small"></div>`;
    });

    if(Object.values(data).length === 0) {
      html+=`<p>No conventions found</p>`;
    }

    return html + `</ul></div>
    `;
  }
}
