import { getParameter } from "../../../../framework/util/urlParmUtils.js";
import { GET_GROUP_REQUEST_STATE, GROUP_NAME_PARAM } from "../../Constants.js";
import { addLoadFunction } from "../../../../framework/state/LoadManager.js";

export class GroupComponent extends HTMLElement {
  constructor() {
    addLoadFunction(GET_GROUP_REQUEST_STATE, function () {
      //createS
    });
    super();
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
