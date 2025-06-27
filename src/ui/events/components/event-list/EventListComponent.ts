import type { GroupSearchResult } from "../../data/types/group/GroupSearchResult.ts";
import { EVENT_LIST_THUNK } from "../../data/search/EventListThunk.ts";
import { updateSearchResultGroupStore } from "../../data/store/SearchResultGroupStore.ts";
import { BaseTemplateDynamicComponent } from "../../../../framework/components/BaseTemplateDynamicComponent.ts";


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
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>
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
      
        <a href="groups.html?name=${encodeURIComponent(group.title)}">Show info</a>
        <h3>
          <a href=${group.url}> Group webpage</a>
        </h3>  
        <p>${group.title}</p>
        <p>${group.locations?.join(", ") ?? ""}</p>              
      </div> 
    `;
    return groupHtml;
  }

  override getTemplateStyle(): string {
    return template;
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
