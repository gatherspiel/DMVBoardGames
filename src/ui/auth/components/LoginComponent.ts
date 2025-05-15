import { showExperimental } from "../../../framework/util/urlParmUtils.ts";
import { initStateOnLoad } from "../../../framework/state/RequestStateManager.ts";
import { setupEventHandlers } from "../AuthEventHandlers.ts";
import { AUTH_API } from "../AuthAPI.ts";
import {
  AUTH_REQUEST_STATE,
  LOGIN_COMPONENT_STATE,
  LOGIN_FORM_ID,
  PASSWORD_INPUT,
  USERNAME_INPUT,
} from "../Constants.js";
import { BaseDynamicComponent } from "../../../framework/components/BaseDynamicComponent.ts";
import { generateDefaultLoginComponentState } from "../types/AuthResponse.ts";
import type { LoginComponentState } from "../types/LoginComponentState.ts";
import { createComponentState } from "../../../framework/state/ComponentStateManager.ts";

export class LoginComponent extends BaseDynamicComponent {
  constructor() {
    super();

    createComponentState(LOGIN_COMPONENT_STATE, this);
    initStateOnLoad({
      stateName: AUTH_REQUEST_STATE,
      dataSource: AUTH_API,
      requestData: {
        username: "",
        password: "",
      },
      dependencyUpdates: function () {
        setupEventHandlers();
      },
    });
  }

  connectedCallback() {
    this.innerHTML = this.generateHTML(generateDefaultLoginComponentState());
  }

  updateData(data: LoginComponentState): void {
    this.innerHTML = this.generateHTML(data);
    setupEventHandlers();
  }

  generateHTML(data: LoginComponentState) {
    if (showExperimental()) {
      if (!data.isLoggedIn) {
        return this.generateLogin(data);
      } else {
        return `<p>User</p>`;
      }
    } else {
      return `<p></p>`;
    }
  }
  generateLogin(data: LoginComponentState) {
    return `<div>
          <form id=${LOGIN_FORM_ID}>
            <label for="username">Email:</label>
            <input type="text" id=${USERNAME_INPUT} name=${USERNAME_INPUT} />
            <label for="username">Password:</label>
            <input type="password" id=${PASSWORD_INPUT} name=${PASSWORD_INPUT} />
            <button type="submit"> Login </button>
          </form>
          <p>${data.message.trim()}</p>
        `;
  }
}

if (!customElements.get("login-component")) {
  customElements.define("login-component", LoginComponent);
}
