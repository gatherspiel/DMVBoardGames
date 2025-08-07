import {
  LOGIN_THUNK,
  getLoginComponentStoreFromLoginResponse,
} from "../data/LoginThunk.ts";

import { getLoginComponentStoreFromLogoutResponse } from "../data/LogoutThunk.ts";

import {
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
import {generateButton} from "../../../shared/components/ButtonGenerator.ts";
import {generateErrorMessage} from "../../../framework/components/utils/StatusIndicators.ts";


const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>

  <style>
    #login-component-container {
      padding-top: 0.25rem;
    }
    .login-element {
    }
    @media screen and (width < 32em) {
      #login-component-container {
        text-align: center;
      }
      .login-element {
        font-size:1rem;
      }
    }

  </style>

`;

export class LoginComponent extends BaseTemplateDynamicComponent {

  hasRendered: boolean;
  constructor() {
    super("loginComponentStore", {
      onLoadStoreConfig: {
        dataSource: LOGIN_THUNK,
        disableCache: true,
      },
      onLoadRequestData: {
        username: "",
        password: "",
      },
      requestThunkReducers: [
        {
          thunk: LOGIN_THUNK,
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
       <div class="login-element">${data.successMessage}</div>
       ${generateButton({
        type: "submit",
        text: "Logout",
        component: this,
        eventHandlerConfig: LOGOUT_EVENT_CONFIG
       })}
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
            componentLabel: "Password",
            inputType: "text",
            value: ""
          })}
        </div>
        
        <br>

        <div id="component-buttons">
        
        ${generateButton({
          class: "login-element",
          type: "submit",
          text: "Login",
          component: this,
          eventHandlerConfig: LOGIN_EVENT_CONFIG
        })}
        
        ${generateButton({
          class: "login-element",
          type: "submit",
          text: "Register",
          component: this,
          eventHandlerConfig: REGISTER_EVENT_CONFIG
        })}

                    
          </div>
          ${this.hasRendered ? generateErrorMessage(data.errorMessage) : ''}
          <div class="login-element success-message">${data.successMessage}</div>
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
