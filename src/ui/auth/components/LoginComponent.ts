import {
  AUTH_REDUCER,
  getLoginComponentStoreFromLoginResponse,
} from "../reducer/AuthReducer.ts";

import { getLoginComponentStoreFromLogoutResponse } from "../reducer/LogoutReducer.ts";

import {
  AUTH_REQUEST_STORE,
  LOGIN_FORM_ID,
  LOGOUT_REQUEST_STORE,
  PASSWORD_INPUT,
  USERNAME_INPUT,
} from "../Constants.js";
import { BaseDynamicComponent } from "../../../framework/components/BaseDynamicComponent.ts";
import { generateDefaultLoginComponentStore } from "../types/AuthResponse.ts";
import type { LoginComponentStore } from "../types/LoginComponentStore.ts";
import {
  LOGIN_EVENT_CONFIG,
  LOGOUT_EVENT_CONFIG,
} from "../AuthEventHandlers.ts";
import { LOGOUT_REDUCER } from "../reducer/LogoutReducer.ts";

export class LoginComponent extends BaseDynamicComponent {
  constructor() {
    super("loginComponentStore", {
      onLoadStoreConfig: {
        storeName: AUTH_REQUEST_STORE,
        dataSource: AUTH_REDUCER,
      },
      onLoadRequestData: {
        username: "",
        password: "",
      },
      requestStoresToCreate: [
        { storeName: LOGOUT_REQUEST_STORE, dataSource: LOGOUT_REDUCER },
      ],
      reducerSubscriptions: [
        {
          reducer: AUTH_REDUCER,
          reducerFunction: getLoginComponentStoreFromLoginResponse,
        },
        {
          reducer: LOGOUT_REDUCER,
          reducerFunction: getLoginComponentStoreFromLogoutResponse,
        },
      ],
    });
  }

  connectedCallback() {
    this.innerHTML = this.render(generateDefaultLoginComponentStore());
  }

  render(data: LoginComponentStore) {
    if (!data.isLoggedIn) {
      return this.generateLogin(data);
    } else {
      return `
        <button ${this.createClickEvent(LOGOUT_EVENT_CONFIG)}>Logout</button>
      <p>Welcome ${data.email}</p>
       `;
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
          <p>${data.errorMessage ? data.errorMessage.trim() : ""}</p>
        `;
  }
}

if (!customElements.get("login-component")) {
  customElements.define("login-component", LoginComponent);
}
