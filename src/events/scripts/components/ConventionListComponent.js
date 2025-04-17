import {
  createComponentState,
  createState,
  subscribeToState,
} from "../../../framework/State/StateManager.js";

export const CONVENTION_LIST_STATE = "conventionListState";
export class ConventionListComponent extends HTMLElement {
  constructor() {
    super();

    createComponentState(CONVENTION_LIST_STATE, this);
  }

  getItemHtml(convention) {
    return `
    <div id = convention-${convention.id} class="conv-list-item">
     <h3>
        <a href=${convention.link}>${convention.name}</a>
      </h3>
      <p>Days: ${convention.days.join(", ")}</p>
    
    </div>
  `;
  }

  generateHtml(data) {
    let html = `<h1>Upcoming conventions</h1>`;
    Object.values(data).forEach((item) => {
      const itemHtml = this.getItemHtml(item);
      html += itemHtml;
    });
    return html;
  }

  updateData(data) {
    const html = this.generateHtml(data);
    this.innerHTML = html;
  }
}

if (!customElements.get("convention-list-component")) {
  customElements.define("convention-list-component", ConventionListComponent);
}
