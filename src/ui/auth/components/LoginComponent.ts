import {getLoginComponentStoreFromLoginResponse, LOGIN_THUNK,} from "../data/LoginThunk.ts";

import {getLoginComponentStoreFromLogoutResponse, LOGOUT_THUNK} from "../data/LogoutThunk.ts";

import {LOGIN_FORM_ID, PASSWORD_INPUT, USERNAME_INPUT,} from "../Constants.js";
import type {LoginComponentStore} from "../types/LoginComponentStore.ts";
import {LOGIN_EVENT_CONFIG, REGISTER_EVENT_CONFIG,} from "../LoginComponentEventHandlers.ts";
import {getLoginComponentStoreFromRegisterResponse, REGISTER_USER_THUNK,} from "../data/RegisterUserThunk.ts";
import {COMPONENT_LABEL_KEY, EVENT_HANDLER_CONFIG_KEY, IS_LOGGED_IN_KEY} from "../../../shared/Constants.ts";
import {BaseTemplateDynamicComponent, DATA_FIELDS, REQUEST_THUNK_REDUCERS_KEY} from "@bponnaluri/places-js";
import {generateButton} from "../../../shared/components/ButtonGenerator.ts";
import {generateErrorMessage} from "@bponnaluri/places-js";


const template = `
  <link rel="stylesheet" type="text/css"  href="/styles/sharedComponentStyles.css"/>

  <style>
    #login-component-container {
      padding-top: 0.25rem;
    }
    .ui-input {
      display: inline-block;
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
    super({
      [REQUEST_THUNK_REDUCERS_KEY]: [
        {
          thunk: LOGIN_THUNK,
          componentReducer: getLoginComponentStoreFromLoginResponse,
        },
        {
          thunk: LOGOUT_THUNK,
          componentReducer: getLoginComponentStoreFromLogoutResponse,
        },
        {
          thunk: REGISTER_USER_THUNK,
          componentReducer: getLoginComponentStoreFromRegisterResponse,
        },
      ],
      [DATA_FIELDS]:[
        {
          fieldName: IS_LOGGED_IN_KEY,
          dataSource: LOGIN_THUNK
        }
      ]
    });
    this.hasRendered = false;
  }

  override getTemplateStyle(): string {
    return template;
  }

  render(data: LoginComponentStore) {
    return data[IS_LOGGED_IN_KEY] ?
        '' :
        this.generateLogin(data)
  }
  generateLogin(data: LoginComponentStore) {
    const html = `
     <div class="ui-section" id="login-component-container">
      <form id=${LOGIN_FORM_ID} ${this.createEvent(LOGIN_EVENT_CONFIG, "submit")}>
        <div class="ui-input">
          ${this.addShortInput({
            id: USERNAME_INPUT,
            [COMPONENT_LABEL_KEY]: "Email",
            inputType: "text",
            value: ""
          })}
        </div>
        
        <div class="ui-input">
          ${this.addShortInput({
            id: PASSWORD_INPUT,
            [COMPONENT_LABEL_KEY]: "Password",
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
          [EVENT_HANDLER_CONFIG_KEY]: LOGIN_EVENT_CONFIG
        })}
        
        ${generateButton({
          class: "login-element",
          type: "submit",
          text: "Register",
          component: this,
          [EVENT_HANDLER_CONFIG_KEY]: REGISTER_EVENT_CONFIG
        })}

                    
          </div>
          ${this.hasRendered ? generateErrorMessage(data.errorMessage) : ''}
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
