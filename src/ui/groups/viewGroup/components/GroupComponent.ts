import { getUrlParameter } from "../../../../framework/utils/UrlParamUtils.ts";
import {
  GROUP_COMPONENT_STORE,
  GROUP_DESCRIPTION_INPUT,
  GROUP_NAME_INPUT,
  GROUP_NAME_PARAM,
  GROUP_URL_INPUT,
} from "../../Constants.js";
import {GROUP_PRELOAD_THUNK, GROUP_REQUEST_THUNK} from "../data/GroupRequestThunk.ts";

import { createJSONProp } from "../../../../framework/components/utils/ComponentUtils.ts";
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
import {ADD_EVENT_PAGE_HANDLER_CONFIG, DELETE_GROUP_PAGE_HANDLER_CONFIG} from "../../../../shared/nav/NavEventHandlers.ts";

const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>

  <style>
 
    a {
      margin-left:1rem;
      margin-right:1rem;
    }
    .group-description {
      background-color: var(--clr-lighter-blue);
      background-image: url("/assets/wood.png");
      border-radius: 10px;
      color: var(--clr-dark-blue);
      font-size: 1.25rem;
      font-weight:600;
      padding: 2rem;
      margin-top: 2rem;
    }
   
    .group-data-input {
      height:24px;
      font-size:24px;
      display: block;
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
  thunkReducers: [
    {
      thunk: GROUP_REQUEST_THUNK,
      componentStoreReducer: groupDataStoreReducer
    },
    {
      thunk: GROUP_PRELOAD_THUNK,
      componentStoreReducer: groupDataStoreReducer
    },
    {
      thunk: UPDATE_GROUP_REQUEST_THUNK,
      componentStoreReducer: function () {
        return {
          isEditing: false,
          successMessage: 'Group update sucessful'
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
       <h1>${groupData.name}
         ${generateButton({
           class: "group-webpage-link",
           text: "Group webpage",
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
           eventHandlerConfig: ADD_EVENT_PAGE_HANDLER_CONFIG,
           eventHandlerParams:{name:groupData.name, id: groupData.id}
         })}
       
       ${generateButtonForEditPermission({
           text: "Delete group",
           component: this,
           eventHandlerConfig: DELETE_GROUP_PAGE_HANDLER_CONFIG,
           eventHandlerParams:{name:groupData.name, id: groupData.id}
         })}

       </div>
    
       <div class="group-description">
       <p>${groupData.description}</p>
       </div>` 
         : `
       <h1>Editing group information</h1>
        
       <form>
       
         ${this.generateInputFormItem({
           id: GROUP_NAME_INPUT,
           componentLabel: "Group name",
           inputType: "text",
           value: groupData.name
         })} 
         
         ${this.generateInputFormItem({
           id: GROUP_URL_INPUT,
           componentLabel: "Group url",
           inputType: "text",
           value: groupData.url
         })} 
         
         ${this.generateTextInputFormItem({
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
    <h1>Upcoming events</h1>
      <div id="group-events">
      ${
        groupData.eventData.length === 0
          ? `<p id="no-event">Click on group link above for event information</p>`
          : `${groupData.eventData
              .map((event: Event) => {
                return `
              <group-page-event-component
                key = ${groupData.id + "event-" + event.id}
                data =${createJSONProp({groupId: groupData.id,...event})}
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
