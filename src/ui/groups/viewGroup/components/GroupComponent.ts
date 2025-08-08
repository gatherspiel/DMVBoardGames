import { getUrlParameter } from "../../../../framework/utils/UrlParamUtils.ts";
import {
  GROUP_COMPONENT_STORE,
  GROUP_DESCRIPTION_INPUT,
  GROUP_NAME_INPUT,
  GROUP_NAME_PARAM,
  GROUP_URL_INPUT,
} from "../../Constants.js";
import {GROUP_PRELOAD_THUNK, GROUP_REQUEST_THUNK} from "../data/GroupRequestThunk.ts";

import { serializeJSONProp } from "../../../../framework/components/utils/ComponentUtils.ts";
import type { GroupPageData } from "../data/types/GroupPageData.ts";
import type { Event } from "../../../homepage/data/types/Event.ts";
import { BaseTemplateDynamicComponent } from "../../../../framework/components/BaseTemplateDynamicComponent.ts";
import {
  CANCEL_GROUP_EDIT_HANDLER,
  EDIT_GROUP_EVENT_CONFIG,
  SAVE_GROUP_CONFIG,
} from "../GroupHandlers.ts";
import { UPDATE_GROUP_REQUEST_THUNK } from "../data/UpdateGroupThunk.ts";

import { getGlobalStateValue } from "../../../../framework/state/data/GlobalStore.ts";
import {PageState} from "../../../../framework/state/PageState.ts";
import {initRequestStore} from "../../../../framework/state/data/RequestStore.ts";
import {REDIRECT_HANDLER_CONFIG} from "../../../../framework/handler/RedirectHandler.ts";
import {generateButton, generateButtonForEditPermission} from "../../../../shared/components/ButtonGenerator.ts";
import {CREATE_EVENT_PAGE_HANDLER_CONFIG, DELETE_GROUP_PAGE_HANDLER_CONFIG} from "../../../../shared/nav/NavEventHandlers.ts";

const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>

  <style>
 
    a {
      margin-left:1rem;
      margin-right:1rem;
    }
    
    .group-description-text {
      display: block;
      position: relative;
      padding: 0.5rem;
      border-radius: 12px;
      font-size: 1.5rem;
      color: var(--clr-dark-blue);
      background-color: #0AACFB;
    }
    
    .group-data-input {
      height:24px;
      font-size:24px;
      display: block;
    }
    
    #${GROUP_NAME_INPUT} {
      width: 600px;
    }
    
    #${GROUP_URL_INPUT} {
      width: 600px;
    }
    
    #${GROUP_DESCRIPTION_INPUT} {
      height: 500px;
      width: 800px;
    }
    
    #group-events {
      border-top: 1px solid var(--clr-lighter-blue);
    }
    
    @media screen and (width < 32em) {
      h1 {
        margin: 0;    
      }
      .group-description {
        padding: 0.5rem;
        margin-top: 1rem;
        font-size:1rem;
      }
      p {
        font-size:1rem;
      }
    }
    
        
  </style>
  <div></div>
`;

const groupDataStoreReducer = function(data:any){
  const isLoggedIn = getGlobalStateValue("isLoggedIn");

  if (!isLoggedIn) {
    data.isEditing = false;
  }
  data.successMessage = '';
  return data;
}

const loadConfig = {
  onLoadStoreConfig: {
    dataSource: GROUP_PRELOAD_THUNK,
  },
  onLoadRequestData: {
    name: getUrlParameter(GROUP_NAME_PARAM),
  },
  requestThunkReducers: [
    {
      thunk: GROUP_REQUEST_THUNK,
      componentReducer: groupDataStoreReducer
    },
    {
      thunk: GROUP_PRELOAD_THUNK,
      componentReducer: groupDataStoreReducer
    },
    {
      thunk: UPDATE_GROUP_REQUEST_THUNK,
      componentReducer: function () {
        return {
          isEditing: false,
          successMessage: 'Group update successful'
        };
      },
    },
  ],
  globalStateLoadConfig: {
    globalFieldSubscriptions: ["isLoggedIn"],
  },
};

export class GroupComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super(GROUP_COMPONENT_STORE, loadConfig);
  }

  connectedCallback(){
    if(PageState.pageLoaded) {
      //@ts-ignore
      loadConfig.onLoadStoreConfig.dataSource = GROUP_REQUEST_THUNK
      loadConfig.onLoadRequestData.name = getUrlParameter(GROUP_NAME_PARAM)
      initRequestStore(loadConfig);
    }
  }

  getTemplateStyle(): string {
    return template;
  }

  render(groupData: GroupPageData): string {

    if (!groupData.permissions) {
      return `<h1>Failed to load group ${getUrlParameter(GROUP_NAME_PARAM)}</h1>`;
    }

    return `

     <div class="ui-section">
     ${groupData.successMessage ? `<h2>Group update sucessful</h2>` : ``}
     ${
       !groupData.isEditing
         ? `<div class="group-title">
       <h1>
         ${generateButton({
           class: "group-webpage-link",
           text: groupData.name,
           component: this,
           eventHandlerConfig: REDIRECT_HANDLER_CONFIG,
           eventHandlerParams: {url: groupData.url}
         })}
       </h1>

       ${generateButtonForEditPermission({
           text: "Edit group info",
           component: this,
           eventHandlerConfig: EDIT_GROUP_EVENT_CONFIG,
       })}
       
       ${generateButtonForEditPermission({
           text: "Add event",
           component: this,
           eventHandlerConfig: CREATE_EVENT_PAGE_HANDLER_CONFIG,
           eventHandlerParams:{name:groupData.name, id: groupData.id}
         })}
       
       ${generateButtonForEditPermission({
           text: "Delete group",
           component: this,
           eventHandlerConfig: DELETE_GROUP_PAGE_HANDLER_CONFIG,
           eventHandlerParams:{name:groupData.name, id: groupData.id}
         })}

       </div>
    
       <div class="raised">
        <span class="shadow"></span>
        <span class="edge"></span>
        <p class="group-description-text">
          ${groupData.description}
        </p> 
       </div>` 
         : `
       <h1>Editing group information</h1>
        
       <form>
       
         ${this.generateShortInput({
           id: GROUP_NAME_INPUT,
           componentLabel: "Group name",
           inputType: "text",
           value: groupData.name
         })} 
         
         ${this.generateShortInput({
           id: GROUP_URL_INPUT,
           componentLabel: "Group url",
           inputType: "text",
           value: groupData.url
         })} 
         
         ${this.generateTextInput({
           id: GROUP_DESCRIPTION_INPUT,
           componentLabel: "Group description",
           inputType: "text",
           value: groupData.description
         })}   

         ${generateButton({
           text: "Save updates",
           type: "submit",
           component: this,
           eventHandlerConfig: SAVE_GROUP_CONFIG,
         })}
         
         ${generateButton({
           text: "Cancel updates",
           type: "submit",
           component: this,
           eventHandlerConfig: CANCEL_GROUP_EDIT_HANDLER,
         })}
         
        </form> 
      `
     }
    <h1 class="hideOnMobile">Upcoming events</h1>
      <div id="group-events">
      ${
        groupData.eventData.length === 0
          ? `<p id="no-event">Click on group link above for event information</p>`
          : `${groupData.eventData
              .map((event: Event) => {
                return `
              <group-page-event-component
                key = ${groupData.id + "event-" + event.id}
                data =${serializeJSONProp({groupId: groupData.id,...event})}
              >
 
              </group-page-event-component>

            `;
              })
              .join(" ")}
          <p>Only events for the next 30 days will be visible. See the group page for information on other events.</p>
          `
      }
      </div>
    `;
  }
}

if (!customElements.get("group-page-component")) {
  customElements.define("group-page-component", GroupComponent);
}
