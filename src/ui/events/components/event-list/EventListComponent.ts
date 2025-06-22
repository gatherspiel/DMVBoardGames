import type { GroupSearchResult } from "../../data/types/group/GroupSearchResult.ts";
import { SHOW_INFO_CONFIG } from "./EventListHandlers.ts";
import { EVENT_LIST_THUNK } from "../../data/search/EventListThunk.ts";
import { updateSearchResultGroupStore } from "../../data/store/SearchResultGroupStore.ts";
import { BaseTemplateDynamicComponent } from "../../../../framework/components/BaseTemplateDynamicComponent.ts";
import {
  getSharedButtonStyles,
  getSharedUiSectionStyles,
} from "../../../utils/SharedStyles.ts";

const loadConfig = {
  thunkReducers: [
    {
      thunk: EVENT_LIST_THUNK,
      componentStoreReducer: updateSearchResultGroupStore,
      reducerField: "groupData",
    },
  ],
};

const template = `
<style>
.event-group h3,
.event-group p {
  display: inline-block;
  margin-left: 2rem;
}
</style>
`;
export class EventListComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super("searchResultGroupStore", loadConfig);
  }

  private getItemHtml(groupId: string, group: GroupSearchResult) {
    let groupHtml = "";
    groupHtml = `
      <div id=${groupId} class=${"event-group"}>
        <button class='show-hide-button' ${this.createClickEvent(SHOW_INFO_CONFIG, groupId)}>
          ${"Show info"}
        </button>
        <h3>
          <a href=${group.url}>${group.title}</a>
        </h3>  
          <p>${group.locations?.join(", ") ?? ""}</p>              
      </div> 
    `;
    return groupHtml;
  }

  override getTemplateStyle(): string {
    return template;
  }

  override getSharedStyle(): string {
    return getSharedButtonStyles() + getSharedUiSectionStyles();
  }

  render(data: any): string {
    const groups = data.groups;
    let html = `<div class="ui-section">`;
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
    return html + `</div>`;
  }
}

if (!customElements.get("event-list-component")) {
  customElements.define("event-list-component", EventListComponent);
}
