import { ApiLoadAction, BaseDynamicComponent } from "/lib/places-js-latest.js";
import { LOGIN_FORM_ID, PASSWORD_INPUT, USERNAME_INPUT } from "./Constants.js";
import {
  SUCCESS_MESSAGE_KEY,
  generateErrorMessage,
  generateSuccessMessage,
} from "../../shared/html/StatusIndicators.js";

import { API_ROOT } from "../shared/Params.js";
import { FaqComponent } from "../static/FaqComponent.js";

import { LOGIN_STORE } from "../../data/user/LoginStore.js";

import { SiteRulesComponent } from "../static/SiteRulesComponent.js";

customElements.define("site-rules-component", SiteRulesComponent);
customElements.define("faq-component", FaqComponent);

const CONFIRM_PASSWORD_INPUT = "confirm-password-input";
const AGREE_RULES_ID = "agree-rules";
const CREATE_ACCOUNT_ID = "complete-registration";

export class CreateAccountComponent extends BaseDynamicComponent {
  constructor() {
    super([
      {
        componentReducer: (loginState) => {
          if (loginState.loggedIn) {
            window.location.assign(window.location.origin);
          }
          const errorMessage =
            new URLSearchParams(document.location.search)
              ?.get("message")
              ?.replaceAll("_", " ") ?? "";

          return {
            ...loginState,
            confirmPassword: "",
            errorMessage: errorMessage,
            password: "",
            username: "",
          };
        },
        dataStore: LOGIN_STORE,
      },
    ]);

    const self = this;
    this.addEventListener("click", (event) => {
      event.preventDefault();
      
      const targetId = event.target?.id;
      if (targetId === AGREE_RULES_ID) {
        self.updateData({
          [AGREE_RULES_ID]: event.target.checked,
          confirmPassword: self.getRootNode().getElementById(CONFIRM_PASSWORD_INPUT)
            ?.value,
          password: self.getRootNode().getElementById(PASSWORD_INPUT)?.value,
          username: self.getRootNode().getElementById(USERNAME_INPUT)?.value,
        });
      }

      if (targetId === CREATE_ACCOUNT_ID) {
        const formData = {
          username: self.getRootNode().getElementById(USERNAME_INPUT)?.value,
          password: self.getRootNode().getElementById(PASSWORD_INPUT)?.value,
          confirmPassword: self.getRootNode().getElementById(CONFIRM_PASSWORD_INPUT)
            ?.value,
        };
        if (
          !formData.username ||
          (!formData.password && !formData.confirmPassword)
        ) {
          self.updateData({
            ...formData,
            errorMessage: "Enter a valid username and password",
          });
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          self.updateData({
            ...formData,
            errorMessage: "Passwords must match",
          });
          return;
        }

        ApiLoadAction.getResponseData({
          body: JSON.stringify({
            email: formData.username,
            password: formData.password,
          }),
          method: "POST",
          url: API_ROOT + `/user/register`,
        }).then((response) => {
          if (response.errorMessage) {
            self.updateData({
              ...formData,
              errorMessage: response.errorMessage,
              successMessage: "",
            });
          } else {
            self.updateData({
              [SUCCESS_MESSAGE_KEY]: `
                  Successfully created account. Check your email for a message to confirm and
                  activate your account.`,
              errorMessage: "",
            });
          }
        });
      }
    }); 
  }
  
  render(data) {
    return `
      <div class="container-xl" id="login-component-container"> 
        <h1>Create account</h1>
        <form id=${LOGIN_FORM_ID}>
          <div id="ui-input">
            <div class="form-section">
              <label class="required-field" id="email">Email</label>
              <input        
                id=${USERNAME_INPUT}
                type="email"
                value="${data.username}"
              />
             </input>   
            </div> 
            <div class="form-section">
              <label class="required-field">Password</label>
              <input        
                id=${PASSWORD_INPUT}
                type="password"
                value="${data.password}"
              />   
              </input>
            </div>
       
            <div class="form-section">
              <label class="required-field">Confirm password</label>
              <input        
                id=${CONFIRM_PASSWORD_INPUT}
                type="password"
                value="${data.confirmPassword}"
              />
            </input>          
            </div> 
          </div>
          ${generateErrorMessage(data.errorMessage)}   
          ${generateSuccessMessage(data[SUCCESS_MESSAGE_KEY])}
          ${
            data[AGREE_RULES_ID]
              ?
                `<button id=${CREATE_ACCOUNT_ID} class="primary">Create account</button>` : `<button class="neutral">Create account</button>`

          } 
          <div id="agree-rules-input">
            <label for="${AGREE_RULES_ID}">I agree to the site rules listed below</label>
            <input type="checkbox" id="${AGREE_RULES_ID}" ${data[AGREE_RULES_ID] ? "checked" : ""}>         
          </div>
          <site-rules-component></site-rules-component>
          <faq-component></faq-component>
        </form>
      </div>
    `;
  }
}
