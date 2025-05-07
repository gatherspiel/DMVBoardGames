import { getParameter } from "../../../../framework/util/urlParmUtils.js";
import {
  GET_GROUP_REQUEST_STATE,
  GROUP_COMPONENT_STATE,
  GROUP_NAME_PARAM,
} from "../../Constants.js";
import { initStateOnLoad } from "../../../../framework/state/RequestStateManager.js";
import { subscribeToComponentState } from "../../../../framework/state/ComponentStateManager.js";
import { GroupRequestAPI } from "../data/GroupRequestAPI.js";

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
    console.log("Updating");
    this.innerHTML = `
      <h1><a href=${groupData.url}>${groupData.name}</a></h1>
      
      <p>${groupData.summary}</p>
      
      <p>${groupData.eventData}</p>
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
