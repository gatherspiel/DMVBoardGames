import type { Convention } from "../data/types/Convention.ts";
import { LOCATIONS_THUNK } from "../data/search/LocationsThunk.ts";
import { BaseTemplateDynamicComponent } from "../../../framework/components/BaseTemplateDynamicComponent.ts";
import {generateButton} from "../../../shared/components/ButtonGenerator.ts";
import {REDIRECT_HANDLER_CONFIG} from "../../../framework/handler/RedirectHandler.ts";

export const CONVENTION_LIST_STORE = "conventionListStore";

const loadConfig = {
  requestThunkReducers: [
    {
      thunk: LOCATIONS_THUNK,
      componentStoreReducer: (data: any) => {
        return data.conventions;
      },
    },
  ],
};

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

export class ConventionListComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super(CONVENTION_LIST_STORE, loadConfig);
  }

  getItemHtml(convention: Convention) {
    return `
    <div id = convention-${convention.id} class="conv-list-item">
     <h3>
      ${generateButton({
        text: `${convention.name}`,
        component: this,
        eventHandlerConfig: REDIRECT_HANDLER_CONFIG,
        eventHandlerParams: {url: convention.url}
      })}
      </h3>
      <p>Days: ${convention.days.join(", ")}</p>
    
    </div>
  `;
  }

  override getTemplateStyle(): string {
    return template;
  }
  render(data: Record<any, Convention>) {
    let html = `<div class="ui-section"><h1 class="hideOnMobile">Upcoming conventions</h1>
        <h2 class="showOnMobile">Upcoming conventions</h2>`;
    Object.values(data).forEach((item) => {
      const itemHtml = this.getItemHtml(item);
      html += itemHtml;
    });
    return html + "</div>";
  }
}

if (!customElements.get("convention-list-component")) {
  customElements.define("convention-list-component", ConventionListComponent);
}
