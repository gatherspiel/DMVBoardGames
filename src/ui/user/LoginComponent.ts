import {LOGIN_STORE,} from "../../data/auth/LoginStore.ts";
import {LOGIN_FORM_ID, PASSWORD_INPUT, USERNAME_INPUT,} from "./Constants.js";

import {
  BaseDynamicComponent,
} from "@bponnaluri/places-js";
import {generateButton} from "../../shared/html/ButtonGenerator.ts";
import {generateErrorMessage} from "../../shared/html/StatusIndicators.ts";

const LOGIN_BUTTON_ID = "login-button";

export class LoginComponent extends BaseDynamicComponent {

  loginAttempted: boolean;
  registerAttempted: boolean;
  constructor() {
    super([{
      componentReducer:(loginState:any)=>{
        if(loginState.loggedIn){
          window.location.assign(window.location.origin);
        }
        return loginState;
      },
      dataStore: LOGIN_STORE,
    }]);
    this.loginAttempted = false;
    this.registerAttempted = false;
  }

  override getTemplateStyle(): string {
    return `  
      <link rel="stylesheet" type="text/css"  href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
        #login-component-container {
          padding-top: 0.25rem;
        }
        input {
          display: block;
        }
        #component-buttons {
          padding-top:0.5rem;
        }   
        .ui-input {
          display: inline-block;
        }
        #email {
          display: inline-block;
        }          
        @media not screen and (width < 32em) {
          #email {
          display: inline-block;
          margin-right:2.85rem;
          }  
        }
        @media screen and (width < 32em) {
          #login-component-container {
            text-align: center;
          }
          .login-element {
            font-size:1rem;
          }
        }
      </style>`;
  }

  retrieveAndValidateFormInputs(shadowRoot:ShadowRoot) {

    const username = (shadowRoot.getElementById(USERNAME_INPUT) as HTMLInputElement)?.value;
    const password = (shadowRoot.getElementById(PASSWORD_INPUT) as HTMLInputElement)?.value;
    if (!username || !password) {
      return {
        errorMessage: "Enter a valid username and password"
      }
    }
    return {
      username: username,
      password: password
    };
  }

  override attachHandlersToShadowRoot(shadowRoot:ShadowRoot){

    const self = this;
    shadowRoot?.addEventListener("click",(event:any)=>{
      event.preventDefault();

      try {
        const targetId = event.target?.id;
        if (targetId === LOGIN_BUTTON_ID){
          self.loginAttempted = true;
          const formInputs = self.retrieveAndValidateFormInputs(shadowRoot)
          if(formInputs.errorMessage){
            self.updateData(formInputs)
          } else {
            LOGIN_STORE.fetchData({
              formInputs
            })
          }
        }

      }catch(e:any){
        if(e.message !== `Permission denied to access property "id"`){
          throw e;
        }
      }
    })
  }

  render(data: any) {
    const isNewUser = new URLSearchParams(document.location.search).get("newUser")

    return `
      <div class="ui-section" id="login-component-container">
      <form id=${LOGIN_FORM_ID}>
      ${isNewUser ? `<h2 class="success-message">Account successfully confirmed. Use this page to login. </h2>` : ``}

        <div class="ui-input">
          <div class="form-section">
            <label class="required-field" id="email">Email</label>
          <input        
            id=${USERNAME_INPUT}
            type="email"
          />     
          </input>    
        </div>
        <div class="form-section">
        <label class="required-field">Password</label>
          <input        
            id=${PASSWORD_INPUT}
            type="password"
          />
          </input> 
        </div>
      </div>       
      <div id="component-buttons">
          ${generateButton({
            class: "login-element",
            id: LOGIN_BUTTON_ID,
            text: "Login",
            type: "submit",
          })}  
      
        </div>
          ${this.loginAttempted || this.registerAttempted ? generateErrorMessage(data.errorMessage) : ''}
        </form>
      </div>
    `;
  }
}