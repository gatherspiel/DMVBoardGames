import { BaseDynamicComponent } from "@bponnaluri/places-js";
import { generateLinkButton} from "../../../shared/components/ButtonGenerator.ts";

import {LOCATIONS_STORE} from "../data/search/LocationsStore.ts";

const loadConfig = [{
  componentReducer: (data:any)=>{
    return data.conventions;
  },
  dataStore: LOCATIONS_STORE,
}]


const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>

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
    let html = `

      <div class="ui-section"><h1 class="hideOnMobile">Upcoming conventions</h1>
      <h2 class="showOnMobile">Upcoming conventions</h2>`;

    Object.values(data).forEach((item:any) => {
      const itemHtml = this.getItemHtml(item);
      html += itemHtml;
    });
    return html + "</div>";
  }
}
