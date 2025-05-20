import { BaseDynamicComponent } from "../../../framework/components/BaseDynamicComponent.ts";
import { createComponentStore } from "../../../framework/store/ComponentStore.ts";
import type { Convention } from "../data/types/Convention.ts";

export const CONVENTION_LIST_STATE = "conventionListState";
export class ConventionListComponent extends BaseDynamicComponent {
  constructor() {
    super();

    createComponentStore(CONVENTION_LIST_STATE, this);
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
