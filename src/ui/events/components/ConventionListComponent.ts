import { BaseDynamicComponent } from "../../../framework/components/BaseDynamicComponent.ts";
import { createComponentStore } from "../../../framework/store/data/ComponentStore.ts";
import type { Convention } from "../data/types/Convention.ts";
import { LOCATIONS_REDUCER } from "../data/search/LocationsReducer.ts";

export const CONVENTION_LIST_STORE = "conventionListStore";

const loadConfig = {
  thunkReducers: [
    {
      thunk: LOCATIONS_REDUCER,
      reducerFunction: (data: any) => {
        return data.conventions;
      },
    },
  ],
};
export class ConventionListComponent extends BaseDynamicComponent {
  constructor() {
    super(CONVENTION_LIST_STORE, loadConfig);
    createComponentStore(CONVENTION_LIST_STORE, this);
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
