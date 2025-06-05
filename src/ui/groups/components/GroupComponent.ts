import { getParameter } from "../../../framework/utils/urlParmUtils.ts";
import {
  GET_GROUP_REQUEST_STORE,
  GROUP_COMPONENT_STORE,
  GROUP_NAME_PARAM,
} from "../Constants.js";
import { GROUP_REQUEST_REDUCER } from "../data/GroupRequestThunk.ts";

import { createJSONProp } from "../../../framework/components/utils/ComponentUtils.ts";
import type { GroupPageData } from "../../events/data/types/GroupPageData.ts";
import type { Event } from "../../events/data/types/Event.ts";
import { BaseTemplateDynamicComponent } from "../../../framework/components/BaseTemplateDynamicComponent.ts";
import { EDIT_GROUP_EVENT_CONFIG } from "./GroupPageHandlers.ts";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    .group-summary {
      margin-left: 2rem;
    }
    .group-description {
      background: hsl(from var(--clr-lighter-blue) h s l / 0.1);
      border-radius: 10px;
      color: var(--clr-dark-blue);
      font-size: 1.25rem;
      font-weight:600;
      margin-left: 1rem;
      padding: 2rem
    }
    .group-title {
       margin-left: 2rem;
    }
  </style>
  
  <div></div>

`;

const loadConfig = {
  onLoadStoreConfig: {
    storeName: GET_GROUP_REQUEST_STORE,
    dataSource: GROUP_REQUEST_REDUCER,
  },
  onLoadRequestData: {
    name: getParameter(GROUP_NAME_PARAM),
  },
  thunkReducers: [
    {
      thunk: GROUP_REQUEST_REDUCER,
      reducerFunction: function (data: any) {
        return data;
      },
    },
  ],
};

export class GroupComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super(GROUP_COMPONENT_STORE, loadConfig);
  }

  getTemplate(): HTMLTemplateElement {
    return template;
  }

  /*
   TODO:

   Make sure user can edit group details
   Make sure group data can be saved
   Make sure event data can be saved.
   */
  render(groupData: GroupPageData): string {
    console.log(groupData);
    return `

    ${
      !groupData.isEditing
        ? `<div class="group-title">
        <h1>Group link: <a href=${groupData.url}>${groupData.name}</a></h1>

    ${groupData.permissions.userCanEdit ? `<button class="group-edit-button" ${this.createClickEvent(EDIT_GROUP_EVENT_CONFIG)}>Edit group</button>` : ``}
    </div>

    <div class="group-summary">
    <p class="group-description">${groupData.summary}</p>
    </div>`
        : `
        <h1>Editing group information</h1>
        <div class="group-title">
        <h1>Group link: <a href=${groupData.url}>${groupData.name}</a></h1>

    ${groupData.permissions.userCanEdit ? `<button class="group-edit-button" ${this.createClickEvent(EDIT_GROUP_EVENT_CONFIG)}>Edit group</button>` : ``}
    </div>

    <div class="group-summary">
    <p class="group-description">${groupData.summary}</p>
    </div>`
    }
      
      

      ${
        groupData.eventData.length === 0
          ? `<p id="no-event">Click on group link above for event information</p>`
          : `${groupData.eventData
              .map((event: Event) => {
                return `
              <event-component
                key = ${groupData.id + "event-" + event.id}
                data =${createJSONProp(event)}
              >
    
              </event-component>
            `;
              })
              .join(" ")}`
      }
      
      <p>Only events for the next 30 days will be visible. See the group page for information on other events.</p>
    `;
  }
}

if (!customElements.get("group-component")) {
  customElements.define("group-component", GroupComponent);
}
