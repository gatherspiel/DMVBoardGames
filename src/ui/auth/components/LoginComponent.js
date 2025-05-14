import { showExperimental } from "../../../framework/util/urlParmUtils.js";
import { isLoggedIn } from "../AuthState.js";
import { initStateOnLoad } from "../../../framework/state/RequestStateManager.ts";
import { setupEventHandlers } from "../AuthEventHandlers.js";
import { AuthAPI } from "../AuthAPI.js";
import {
  AUTH_STATE,
  LOGIN_FORM_ID,
  PASSWORD_INPUT,
  USERNAME_INPUT,
} from "../Constants.js";

export class LoginComponent extends HTMLElement {
  constructor() {
    super();

    initStateOnLoad({
      stateName: AUTH_STATE,
      dataSource: new AuthAPI(),
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
    console.log(showExperimental());
    this.innerHTML = this.generateHTML();
  }

  updateData(state) {
    this.innerHTML = this.generateHTML();
    setupEventHandlers();
  }

  generateHTML() {
    if (showExperimental()) {
      if (!isLoggedIn()) {
        return this.generateLogin();
      } else {
        return `<p>User</p>`;
      }
    } else {
      return `<p></p>`;
    }
  }
  generateLogin() {
    return `<div>
          <form id=${LOGIN_FORM_ID}>
            <label for="username">Email:</label>
            <input type="text" id=${USERNAME_INPUT} name=${USERNAME_INPUT} />
            <label for="username">Password:</label>
            <input type="password" id=${PASSWORD_INPUT} name=${PASSWORD_INPUT} />
            <button type="submit"> Login </button>
          </form>
        `;
  }
}

if (!customElements.get("login-component")) {
  customElements.define("login-component", LoginComponent);
}
