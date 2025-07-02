import type { Convention } from "../data/types/Convention.ts";
import { LOCATIONS_THUNK } from "../data/search/LocationsThunk.ts";
import { BaseTemplateDynamicComponent } from "../../../framework/components/BaseTemplateDynamicComponent.ts";

export const CONVENTION_LIST_STORE = "conventionListStore";

const loadConfig = {
  thunkReducers: [
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
        <a href=${convention.url}>${convention.name}</a>
      </h3>
      <p>Days: ${convention.days.join(", ")}</p>
    
    </div>
  `;
  }

  override getTemplateStyle(): string {
    return template;
  }
  render(data: Record<any, Convention>) {
    let html = `<div class="ui-section"><h1>Upcoming conventions</h1>`;
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
