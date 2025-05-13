import { getParameter } from "../../../framework/util/urlParmUtils.js";
import {
  GET_GROUP_REQUEST_STATE,
  GROUP_COMPONENT_STATE,
  GROUP_NAME_PARAM,
} from "../Constants.js";
import { initStateOnLoad } from "../../../framework/state/RequestStateManager.ts";
import { subscribeToComponentState } from "../../../framework/state/ComponentStateManager.js";
import { GroupRequestAPI } from "../data/GroupRequestAPI.js";

import { createJSONProp } from "../../../framework/components/utils/ComponentUtils.ts";

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
export class GroupComponent extends HTMLElement {
  constructor() {
    super();

    subscribeToComponentState(GROUP_COMPONENT_STATE, this);
    initStateOnLoad({
      stateName: GET_GROUP_REQUEST_STATE,
      dataSource: new GroupRequestAPI(),
      requestData: {
        name: getParameter(GROUP_NAME_PARAM),
      },
    });
  }

  updateData(groupData) {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    const div = this.shadowRoot.querySelector("div");

    div.innerHTML = `

      <div class="group-title">
        <h1><a href=${groupData.url}>${groupData.name}</a></h1>
      </div>
      
      <div class="group-summary">
        <p class="group-description">${groupData.summary}</p>
      </div>
      

      ${
        groupData.eventData.length === 0
          ? `<p id="no-event">Click on group link above for event information</p>`
          : `${groupData.eventData
              .map((event) => {
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
  //TODO: Add loading animation
  connectedCallback() {
    const groupParameter = getParameter(GROUP_NAME_PARAM);
    if (groupParameter) {
      this.textContent = `Loading group data for group ${groupParameter}`;
    } else {
      this.textContent = "Invalid group";
    }
  }
}

if (!customElements.get("group-component")) {
  customElements.define("group-component", GroupComponent);
}
