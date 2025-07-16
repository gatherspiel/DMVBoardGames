import type { GroupSearchResult } from "../../data/types/group/GroupSearchResult.ts";
import { EVENT_SEARCH_THUNK } from "../../data/search/EventSearchThunk.ts";
import { updateSearchResultGroupStore } from "../../data/store/SearchResultGroupStore.ts";
import { BaseTemplateDynamicComponent } from "../../../../framework/components/BaseTemplateDynamicComponent.ts";

const loadConfig = {
  thunkReducers: [
    {
      thunk: EVENT_SEARCH_THUNK,
      componentStoreReducer: updateSearchResultGroupStore,
      reducerField: "groupData",
    },
  ],
};

const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>
  <style>
    @media not screen and (width < 32em) {
      .event-group p {
        display: inline-block;
        margin-left: 2rem;
      }
      .group-webpage-link {
        margin-left: 2rem;
      }
      .group-page-links {
        display: inline-block;
      }
    }  
    @media screen and (width < 32em) {
      a {
        margin-top: 1rem;
      }
      .event-group {
        border-bottom: 1px solid var(--clr-lighter-blue);
      }
      .event-group-location {
        display: none; 
      }
      .ui-section .event-group:not(:first-child) {
        margin-top: 0.5rem;
      }
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
        <div class = "group-page-links">
          <a href="groups.html?name=${encodeURIComponent(group.title)}">Show info</a>
          <a class="group-webpage-link" href=${group.url}> Group webpage</a>
        </div>

        <p>${group.title}</p>
        <p class="event-group-location">${group.locations?.join(", ") ?? ""}</p>              
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
