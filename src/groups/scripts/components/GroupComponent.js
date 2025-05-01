import { getParameter } from "../../../framework/util/urlParmUtils.js";
import { GROUP_NAME_PARAM } from "../../Constants.js";

export class GroupComponent extends HTMLElement {
  constructor() {
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
