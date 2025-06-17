import { BaseDynamicComponent } from "../../../framework/components/BaseDynamicComponent.ts";
import type { Convention } from "../data/types/Convention.ts";
import { LOCATIONS_THUNK } from "../data/search/LocationsThunk.ts";

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
export class ConventionListComponent extends BaseDynamicComponent {
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

  render(data: Record<any, Convention>) {
    let html = `<h1>Upcoming conventions</h1>`;
    Object.values(data).forEach((item) => {
      const itemHtml = this.getItemHtml(item);
      html += itemHtml;
    });
    return html;
  }
}

if (!customElements.get("convention-list-component")) {
  customElements.define("convention-list-component", ConventionListComponent);
}
