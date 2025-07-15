import {
  AUTH_THUNK,
  getLoginComponentStoreFromLoginResponse,
} from "../data/AuthThunk.ts";

import { getLoginComponentStoreFromLogoutResponse } from "../data/LogoutThunk.ts";

import {
  AUTH_REQUEST_STORE,
  LOGIN_FORM_ID,
  PASSWORD_INPUT,
  USERNAME_INPUT,
} from "../Constants.js";
import type { LoginComponentStore } from "../types/LoginComponentStore.ts";
import {
  LOGIN_EVENT_CONFIG,
  LOGOUT_EVENT_CONFIG,
  REGISTER_EVENT_CONFIG,
} from "../LoginComponentEventHandlers.ts";
import { LOGOUT_THUNK } from "../data/LogoutThunk.ts";
import {
  getLoginComponentStoreFromRegisterResponse,
  REGISTER_USER_THUNK,
} from "../data/RegisterUserThunk.ts";
import { BaseTemplateDynamicComponent } from "../../../framework/components/BaseTemplateDynamicComponent.ts";

const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>

  <style>
    #login-component-container {
      padding-top: 0.25rem;
    }
    .login-element {
      display: inline-block;
    }
    @media screen and (width < 32em) {
      #login-component-container {
        text-align: center;
      }
    }

  </style>

`;

export class LoginComponent extends BaseTemplateDynamicComponent {

  hasRendered: boolean;
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
    this.hasRendered = false;
  }

  override getTemplateStyle(): string {
    return template;
  }

  render(data: LoginComponentStore) {
    if (!data.isLoggedIn) {
      return this.generateLogin(data);
    } else {
      return `
       <div class="ui-section" id="login-component-container">
        <p class="login-element">${data.successMessage}</p>
        <button class="login-element" ${this.createClickEvent(LOGOUT_EVENT_CONFIG)}>Logout</button>
      </div>
       `;
    }
  }
  generateLogin(data: LoginComponentStore) {
    const html = `
     <div class="ui-section" id="login-component-container">
      <form id=${LOGIN_FORM_ID} ${this.createSubmitEvent(LOGIN_EVENT_CONFIG)}>
      
      
       
        <div class="ui-input">
          ${this.generateInputFormItem({
            id: USERNAME_INPUT,
            componentLabel: "Email",
            inputType: "text",
            value: ""
          })}
        </div>
        
        <div class="ui-input">
          ${this.generateInputFormItem({
            id: PASSWORD_INPUT,
            componentLabel: "password",
            inputType: "text",
            value: ""
          })}
        </div>
        
        <br>

        <div id="component-buttons">
          <button class="login-element" type="submit"  name="action" value="Login"> Login </button>
            <button 
              class="login-button"
              type="submit" 
              ${this.createClickEvent(REGISTER_EVENT_CONFIG)} 
              name="action" value="Register"> 
                Register 
            </button>       
          </div>
          ${this.hasRendered ? this.generateErrorMessage(data.errorMessage) : ''}
          <p class="login-element">${data.successMessage}</p>
        </form>

    </div>
    `;
    this.hasRendered = true;
    return html;
  }
}

if (!customElements.get("login-component")) {
  customElements.define("login-component", LoginComponent);
}
