import {
  AUTH_THUNK,
  getLoginComponentStoreFromLoginResponse,
} from "../reducer/AuthThunk.ts";

import { getLoginComponentStoreFromLogoutResponse } from "../reducer/LogoutThunk.ts";

import {
  AUTH_REQUEST_STORE,
  LOGIN_FORM_ID,
  LOGOUT_REQUEST_STORE,
  PASSWORD_INPUT,
  USERNAME_INPUT,
} from "../Constants.js";
import { BaseDynamicComponent } from "../../../framework/components/BaseDynamicComponent.ts";
import type { LoginComponentStore } from "../types/LoginComponentStore.ts";
import {
  LOGIN_EVENT_CONFIG,
  LOGOUT_EVENT_CONFIG,
} from "../AuthEventHandlers.ts";
import { LOGOUT_THUNK } from "../reducer/LogoutThunk.ts";

export class LoginComponent extends BaseDynamicComponent {
  constructor() {
    super("loginComponentStore", {
      onLoadStoreConfig: {
        storeName: AUTH_REQUEST_STORE,
        dataSource: AUTH_THUNK,
      },
      onLoadRequestData: {
        username: "",
        password: "",
      },
      requestStoresToCreate: [
        { storeName: LOGOUT_REQUEST_STORE, dataSource: LOGOUT_THUNK },
      ],
      thunkReducers: [
        {
          thunk: AUTH_THUNK,
          reducerFunction: getLoginComponentStoreFromLoginResponse,
        },
        {
          thunk: LOGOUT_THUNK,
          reducerFunction: getLoginComponentStoreFromLogoutResponse,
        },
      ],
    });
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
