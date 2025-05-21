import {
  AUTH_REDUCER,
  getLoginComponentStoreFromResponse,
} from "../AuthReducer.ts";
import {
  AUTH_REQUEST_STORE,
  LOGIN_COMPONENT_STORE,
  LOGIN_FORM_ID,
  PASSWORD_INPUT,
  USERNAME_INPUT,
} from "../Constants.js";
import { BaseDynamicComponent } from "../../../framework/components/BaseDynamicComponent.ts";
import { generateDefaultLoginComponentStore } from "../types/AuthResponse.ts";
import type { LoginComponentStore } from "../types/LoginComponentStore.ts";
import { LOGIN_EVENT_CONFIG } from "../AuthEventHandlers.ts";

export class LoginComponent extends BaseDynamicComponent {
  constructor() {
    super(LOGIN_COMPONENT_STORE, {
      storeName: AUTH_REQUEST_STORE,
      dataSource: AUTH_REDUCER,
      requestData: {
        username: "",
        password: "",
      },
    });
    this.subscribeToReducer(AUTH_REDUCER, getLoginComponentStoreFromResponse);
  }

  connectedCallback() {
    this.innerHTML = this.render(generateDefaultLoginComponentStore());
  }

  render(data: LoginComponentStore) {
    if (!data.isLoggedIn) {
      return this.generateLogin(data);
    } else {
      return `<p>Welcome ${data.email}</p>`;
    }
  }
  generateLogin(data: LoginComponentStore) {
    return `<div>
          <form id=${LOGIN_FORM_ID} ${this.createSubmitEvent(LOGIN_EVENT_CONFIG)}>
            <label for="username">Email:</label>
            <input type="text" id=${USERNAME_INPUT} name=${USERNAME_INPUT} />
            <label for="username">Password:</label>
            <input type="password" id=${PASSWORD_INPUT} name=${PASSWORD_INPUT} />
            <button type="submit" > Login </button>
          </form>
          <p>${data.errorMessage.trim()}</p>
        `;
  }
}

if (!customElements.get("login-component")) {
  customElements.define("login-component", LoginComponent);
}
