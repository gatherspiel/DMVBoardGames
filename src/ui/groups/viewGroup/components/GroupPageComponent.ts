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
  EDIT_GROUP_EVENT_CONFIG,
  SAVE_GROUP_CONFIG,
} from "../GroupPageHandlers.ts";
import { UPDATE_GROUP_REQUEST_THUNK } from "../data/UpdateGroupThunk.ts";

import { getGlobalStateValue } from "../../../../framework/state/data/GlobalStore.ts";
import {initRequestStore} from "../../../../framework/state/data/RequestStore.ts";

const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>

  <style>
 
    a {
        margin-left:1rem;
        margin-right:1rem;
    }
    .group-description {
      background: hsl(from var(--clr-lighter-blue) h s l / 0.1);
      border-radius: 10px;
      color: var(--clr-dark-blue);
      font-size: 1.25rem;
      font-weight:600;
      padding: 2rem;
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

export class GroupPageComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super(GROUP_COMPONENT_STORE, loadConfig);

  }

  async fetchData(){
    const data = await GROUP_REQUEST_THUNK.retrieveData({"name":"Beer & Board Games"});
    this.updateStore(data);
  }

  connectedCallback(){
    loadConfig.onLoadRequestData.name = getUrlParameter("name");
    initRequestStore(loadConfig)
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
       <h1>${groupData.name} <a href=${groupData.url}>Group webpage</a></h1>

       ${this.generateButtonsForEditPermission({
         "Edit group": EDIT_GROUP_EVENT_CONFIG
       })}
       ${this.generateLinksForEditPermission({
         "Add event": `groups/addEvent.html?groupName=${encodeURIComponent(groupData.name)}&groupId=${groupData.id}`,
         "Delete group": `groups/delete.html?name=${encodeURIComponent(groupData.name)}&groupId=${groupData.id}`
       })}
       </div>
    
       <div class="group-description">
       <p>${groupData.description}</p>
       </div>` 
         : `
       <h1>Editing group information</h1>
        
       <form ${this.createSubmitEvent(SAVE_GROUP_CONFIG)}>
       
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
          <button type="submit" >Save updates</button>
        </form> 
      `
     }
    <h1>Upcoming events</h1>

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
  customElements.define("group-page-component", GroupPageComponent);
}
