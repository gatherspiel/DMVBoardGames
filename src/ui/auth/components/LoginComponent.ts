import {
  AUTH_THUNK,
  getLoginComponentStoreFromLoginResponse,
} from "../data/AuthThunk.ts";

import { getLoginComponentStoreFromLogoutResponse } from "../data/LogoutThunk.ts";

import {
  AUTH_REQUEST_STORE,
  LOGIN_FORM_ID,
  LOGOUT_REQUEST_STORE,
  PASSWORD_INPUT,
  REGISTER_REQUEST_STORE,
  USERNAME_INPUT,
} from "../Constants.js";
import type { LoginComponentStore } from "../types/LoginComponentStore.ts";
import {
  LOGIN_EVENT_CONFIG,
  LOGOUT_EVENT_CONFIG,
  REGISTER_EVENT_CONFIG,
} from "../AuthEventHandlers.ts";
import { LOGOUT_THUNK } from "../data/LogoutThunk.ts";
import {
  getLoginComponentStoreFromRegisterResponse,
  REGISTER_USER_THUNK,
} from "../data/RegisterUserThunk.ts";
import { BaseTemplateDynamicComponent } from "../../../framework/components/BaseTemplateDynamicComponent.ts";
import { getSharedButtonStyles } from "../../utils/sharedStyles.ts";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    #login-component-container {
      padding-top: 0.25rem;
    }
    #authentication-error-message {
      color:darkred;
    }
  </style>

`;

export class LoginComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super("loginComponentStore", {
      onLoadStoreConfig: {
        storeName: AUTH_REQUEST_STORE,
        dataSource: AUTH_THUNK,
        disableCache: true,
      },
      onLoadRequestData: {
        username: "",
        password: "",
      },
      requestStoresToCreate: [
        { storeName: LOGOUT_REQUEST_STORE, dataSource: LOGOUT_THUNK },
        { storeName: REGISTER_REQUEST_STORE, dataSource: REGISTER_USER_THUNK },
      ],
      thunkReducers: [
        {
          thunk: AUTH_THUNK,
          componentStoreReducer: getLoginComponentStoreFromLoginResponse,
        },
        {
          thunk: LOGOUT_THUNK,
          componentStoreReducer: getLoginComponentStoreFromLogoutResponse,
        },
        {
          thunk: REGISTER_USER_THUNK,
          componentStoreReducer: getLoginComponentStoreFromRegisterResponse,
        },
      ],
    });
  }

  override getTemplate(): HTMLTemplateElement {
    return template;
  }

  override getSharedStyle(): string {
    return getSharedButtonStyles();
  }

  render(data: LoginComponentStore) {
    if (!data.isLoggedIn) {
      return this.generateLogin(data);
    } else {
      return `
       <div id="login-component-container">

        <button class="login-button" ${this.createClickEvent(LOGOUT_EVENT_CONFIG)}>Logout</button>
      <p>${data.successMessage}</p>
      </div>
       `;
    }
  }
  generateLogin(data: LoginComponentStore) {
    return `
       <div id="login-component-container">
      <form id=${LOGIN_FORM_ID} ${this.createSubmitEvent(LOGIN_EVENT_CONFIG)}>
        <label for="username">Email:</label>
        <input type="text" id=${USERNAME_INPUT} name=${USERNAME_INPUT} />
        <label for="username">Password:</label>
        <input type="password" id=${PASSWORD_INPUT} name=${PASSWORD_INPUT} />
        
        <br>

        <div id="component-buttons">
          <button class="login-button" type="submit"  name="action" value="Login"> Login </button>
            <button 
              class="login-button"
              type="submit" 
              ${this.createClickEvent(REGISTER_EVENT_CONFIG)} 
              name="action" value="Register"> 
                Register 
            </button>       
          </div>
     

      </form>
      <p id="authentication-error-message">${data.errorMessage ? data.errorMessage.trim() : ""}</p>
      
      
      <p>${data.successMessage}</p>
      </div>
    `;
  }
}

if (!customElements.get("login-component")) {
  customElements.define("login-component", LoginComponent);
}
