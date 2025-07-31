import type { GroupSearchResult } from "../../data/types/group/GroupSearchResult.ts";
import {EVENT_PRELOAD_THUNK, EVENT_SEARCH_THUNK} from "../../data/search/EventSearchThunk.ts";
import { updateSearchResultGroupStore } from "../../data/store/SearchResultGroupStore.ts";
import { BaseTemplateDynamicComponent } from "../../../../framework/components/BaseTemplateDynamicComponent.ts";
import {VIEW_GROUP_PAGE_HANDLER_CONFIG} from "../../../../shared/nav/NavEventHandlers.ts";
import {generateButton} from "../../../../shared/components/ButtonGenerator.ts";

const loadConfig = {
  requestThunkReducers: [
    {
      thunk: EVENT_PRELOAD_THUNK,
      componentStoreReducer: updateSearchResultGroupStore,
      reducerField: "groupData"
    },
    {
      thunk: EVENT_SEARCH_THUNK,
      componentStoreReducer: updateSearchResultGroupStore,
      reducerField: "groupData",
    },
  ],
};

const template = `

  <link rel="preload" as="style" href="/styles/sharedComponentStyles.css" onload="this.rel='stylesheet'"/>
  <style>
    .ui-section {
      visibility: hidden;
    }
    
    .pushable {
      display: inline-block;
    }
    
    .event-group:not(:first-child){
      border-top: 1px solid var(--clr-lighter-blue);
    }
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
        
         ${generateButton({
          type: "submit",
          text: group.title,
          component: this,
          eventHandlerConfig: VIEW_GROUP_PAGE_HANDLER_CONFIG,
          eventHandlerParams: {name: group.title}
        })}
         
        
        <p class="event-group-location">${group.locations?.join(", ") ?? ""}</p>              
        </div> 
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
