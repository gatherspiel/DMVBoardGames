import type { GroupSearchResult } from "../../data/types/group/GroupSearchResult.ts";
import { updateSearchResultGroupStore } from "../../data/store/SearchResultGroupStore.ts";
import { BaseTemplateDynamicComponent } from "../../../../framework/components/BaseTemplateDynamicComponent.ts";
import {VIEW_GROUP_PAGE_HANDLER_CONFIG} from "../../../../shared/nav/NavEventHandlers.ts";
import {generateButton} from "../../../../shared/components/ButtonGenerator.ts";
import {getDisplayNameArray} from "../../../../shared/DisplayNameConversion.ts";
import {
  DEFAULT_GLOBAL_STATE_REDUCER_KEY,
  GLOBAL_FIELD_SUBSCRIPTIONS_KEY,
  GLOBAL_STATE_LOAD_CONFIG_KEY,
} from "../../../../framework/components/types/ComponentLoadConfig.ts";
import {EVENT_HANDLER_CONFIG_KEY, EVENT_HANDLER_PARAMS_KEY} from "../../../../shared/Constants.ts";
import {SEARCH_RESULTS} from "../../../../shared/InitGlobalStateConfig.ts";
import {initRequestStore} from "../../../../framework/state/data/RequestStore.ts";

const loadConfig = {
  [GLOBAL_STATE_LOAD_CONFIG_KEY]: {
    [GLOBAL_FIELD_SUBSCRIPTIONS_KEY]:[SEARCH_RESULTS],
    [DEFAULT_GLOBAL_STATE_REDUCER_KEY]: updateSearchResultGroupStore
  }
};

const template = `

  <link rel="preload" as="style" href="/styles/sharedComponentStyles.css" onload="this.rel='stylesheet'"/>
  <style>

    .raised {
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

  connectedCallback(){
    initRequestStore(loadConfig);
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
          [EVENT_HANDLER_CONFIG_KEY]: VIEW_GROUP_PAGE_HANDLER_CONFIG,
          [EVENT_HANDLER_PARAMS_KEY]: {name: group.title}
        })}
         
        
        <p class="event-group-location">${getDisplayNameArray(group.locations)?.join(", ") ?? ""}</p>              
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
    if (data && Object.values(groups).length > 0) {
      Object.keys(groups).forEach((groupId) => {
        const group = groups[groupId];
        html += this.getItemHtml(groupId, group);
      });
    }

    else  {
      html += `
      <p>No groups found.</p>
    `;
    }
    return html + `</div>`;
  }
}

if (!customElements.get("event-list-component")) {
  customElements.define("event-list-component", EventListComponent);
}
