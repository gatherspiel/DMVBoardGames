import { getUrlParameter } from "../../../../framework/utils/UrlParamUtils.ts";
import {
  GROUP_COMPONENT_STORE,
  GROUP_DESCRIPTION_INPUT, GROUP_DESCRIPTION_TEXT,
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
import {
  COMPONENT_LABEL_KEY,
  EVENT_HANDLER_CONFIG_KEY, EVENT_HANDLER_PARAMS_KEY,
  IS_LOGGED_IN_KEY,
  SUCCESS_MESSAGE_KEY
} from "../../../../shared/Constants.ts";
import {
  GLOBAL_FIELD_SUBSCRIPTIONS_KEY,
  GLOBAL_STATE_LOAD_CONFIG_KEY,
  ON_LOAD_REQUEST_DATA_KEY,
  ON_LOAD_STORE_CONFIG_KEY, REQUEST_THUNK_REDUCERS_KEY
} from "../../../../framework/components/types/ComponentLoadConfig.ts";

const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>

  <style>
 
    a {
      margin-left:1rem;
      margin-right:1rem;
    }
    
    .${GROUP_DESCRIPTION_TEXT} {
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
      .${GROUP_DESCRIPTION_TEXT} {
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

const groupDataStoreReducer = (data:any)=>{
  const isLoggedIn = getGlobalStateValue(IS_LOGGED_IN_KEY);

  if (!isLoggedIn) {
    data.isEditing = false;
  }
  data[SUCCESS_MESSAGE_KEY] = '';
  return data;
}

const loadConfig = {
  [ON_LOAD_STORE_CONFIG_KEY]: {
    dataSource: GROUP_PRELOAD_THUNK,
  },
  [ON_LOAD_REQUEST_DATA_KEY]: {
    name: getUrlParameter(GROUP_NAME_PARAM),
  },
  [REQUEST_THUNK_REDUCERS_KEY]: [
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
      componentReducer:  () =>{
        return {
          isEditing: false,
          [SUCCESS_MESSAGE_KEY]: 'Group update successful'
        };
      },
    },
  ],
  [GLOBAL_STATE_LOAD_CONFIG_KEY]: {
    [GLOBAL_FIELD_SUBSCRIPTIONS_KEY]: [IS_LOGGED_IN_KEY],
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
     ${groupData[SUCCESS_MESSAGE_KEY] ? `<h2>Group update successful</h2>` : ``}
     ${
       !groupData.isEditing
         ? `<div class="group-title">
       <h1>
         ${generateButton({
           class: "group-webpage-link",
           text: groupData.name,
           component: this,
           [EVENT_HANDLER_CONFIG_KEY]: REDIRECT_HANDLER_CONFIG,
           [EVENT_HANDLER_PARAMS_KEY]: {url: groupData.url}
         })}
       </h1>

       ${generateButtonForEditPermission({
           text: "Edit group info",
           component: this,
           [EVENT_HANDLER_CONFIG_KEY]: EDIT_GROUP_EVENT_CONFIG,
       })}
       
       ${generateButtonForEditPermission({
           text: "Add event",
           component: this,
           [EVENT_HANDLER_CONFIG_KEY]: CREATE_EVENT_PAGE_HANDLER_CONFIG,
           [EVENT_HANDLER_PARAMS_KEY]:{name:groupData.name, id: groupData.id}
         })}
       
       ${generateButtonForEditPermission({
           text: "Delete group",
           component: this,
           [EVENT_HANDLER_CONFIG_KEY]: DELETE_GROUP_PAGE_HANDLER_CONFIG,
           [EVENT_HANDLER_PARAMS_KEY]:{name:groupData.name, id: groupData.id}
         })}

       </div>
    
       <div class="raised">
        <span class="shadow"></span>
        <span class="edge"></span>
        <p class="${GROUP_DESCRIPTION_TEXT}">
          ${groupData.description}
        </p> 
       </div>` 
         : `
       <h1>Editing group information</h1>
        
       <form>
       
         ${this.addShortInput({
           id: GROUP_NAME_INPUT,
           [COMPONENT_LABEL_KEY]: "Group name",
           inputType: "text",
           value: groupData.name
         })} 
         
         ${this.addShortInput({
           id: GROUP_URL_INPUT,
           [COMPONENT_LABEL_KEY]: "Group url",
           inputType: "text",
           value: groupData.url
         })} 
         
         ${this.addTextInput({
           id: GROUP_DESCRIPTION_INPUT,
           [COMPONENT_LABEL_KEY]: "Group description",
           inputType: "text",
           value: groupData.description
         })}   

         ${generateButton({
           text: "Save updates",
           type: "submit",
           component: this,
           [EVENT_HANDLER_CONFIG_KEY]: SAVE_GROUP_CONFIG,
         })}
         
         ${generateButton({
           text: "Cancel updates",
           type: "submit",
           component: this,
           [EVENT_HANDLER_CONFIG_KEY]: CANCEL_GROUP_EDIT_HANDLER,
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
