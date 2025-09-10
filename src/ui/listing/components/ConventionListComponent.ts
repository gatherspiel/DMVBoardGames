import { BaseDynamicComponent } from "@bponnaluri/places-js";
import { generateLinkButton} from "../../../shared/components/ButtonGenerator.ts";

import {LOCATIONS_STORE} from "../data/search/LocationsStore.ts";

import {ListingNavComponent} from "../../../shared/components/ListingNavComponent.ts";
customElements.define("listing-nav-component", ListingNavComponent);

const loadConfig = [{
  componentReducer: (data:any)=>{
    return data.conventions;
  },
  dataStore: LOCATIONS_STORE,
}]


const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>

   <style>
  .conv-list-item > * {
    display: inline-block;
  }
  
  h3 {
    font-size: 1.5rem;
  }
  
  p {
    padding-left: 0.5rem;
  }


</style>`;

export class ConventionListComponent extends BaseDynamicComponent {
  constructor() {
    super(loadConfig);
  }

  getItemHtml(convention: any) {
    return `
    <div id = convention-${convention.id} class="conv-list-item">
     <h3>
      ${generateLinkButton({
        text: convention.name,
        url: convention.url
      })}
      </h3>
      <p>Days: ${convention.days.join(", ")}</p>
    
    </div>
  `;
  }

  override getTemplateStyle(): string {
    return template;
  }

  render(data: any) {
    console.log(Object.values(data).length)
    let html = `
      <listing-nav-component
        class="ui-section"
        id="show-info-ui"
        currentPage="conventions.html?${Math.random()}"
      >
      </listing-nav-component>

      <div class="ui-section"><h1 class="hideOnMobile">Upcoming conventions</h1>
      <h2 class="showOnMobile">Upcoming conventions</h2>`;

    Object.values(data).forEach((item:any) => {
      const itemHtml = this.getItemHtml(item);
      html += itemHtml;
    });

    if(Object.values(data).length === 0) {
      html+=`<p>No conventions found</p>`;
    }

    return html + "</div>";
  }
}
