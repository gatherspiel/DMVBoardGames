import { subscribeToComponentStore } from "../../../../framework/store/ComponentStore.ts";
import { BaseDynamicComponent } from "../../../../framework/components/BaseDynamicComponent.ts";
import type { GroupSearchResult } from "../../data/types/GroupSearchResult.ts";
import { GROUP_SEARCH_RESULT_STORE } from "../event-search/Constants.ts";
import { SHOW_INFO_CONFIG } from "./EventListHandlers.ts";

export class EventListComponent extends BaseDynamicComponent {
  constructor() {
    super(GROUP_SEARCH_RESULT_STORE);
    subscribeToComponentStore(GROUP_SEARCH_RESULT_STORE, this);
  }

  private getItemHtml(groupId: string, group: GroupSearchResult) {
    let groupHtml = "";
    groupHtml = `
      <div id=${groupId} class=${"event-group"}>
        <button class='show-hide-button' ${this.createClickEvent(SHOW_INFO_CONFIG, groupId)}>
          ${"Show info"}
        </button>
        <h2>
          <a href=${group.url}>${group.title}</a>
        </h2>  
          <p>${group.locations.join(", ")}</p>              
      </div> 
    `;
    return groupHtml;
  }

  render(data: any): string {
    const groups = data.groups;
    let html = ``;
    let visibleEvents = 0;
    if (data && Object.values(groups).length > 0) {
      Object.keys(groups).forEach((groupId) => {
        const group = groups[groupId];
        let groupHtml = "";
        groupHtml = this.getItemHtml(groupId, group);
        html += groupHtml;
        visibleEvents++;
      });
    }

    if (visibleEvents === 0) {
      html += `
      <p>No groups with events found.</p>
    `;
    }
    return html;
  }
}

if (!customElements.get("event-list-component")) {
  customElements.define("event-list-component", EventListComponent);
}
