import {LOGIN_STORE,} from "./data/LoginStore.ts";
import {LOGOUT_STORE} from "./data/LogoutStore.ts";
import {LOGIN_FORM_ID, PASSWORD_INPUT, USERNAME_INPUT,} from "./Constants.js";
import {
  IS_LOGGED_IN_KEY, SUCCESS_MESSAGE_KEY,
} from "../../shared/Constants.ts";
import {
  ApiLoadAction,
  BaseDynamicComponent,
} from "@bponnaluri/places-js";
import {generateErrorMessage, generateSuccessMessage} from "../../shared/components/StatusIndicators.ts";
import {generateButton} from "../../shared/components/ButtonGenerator.ts";
import {API_ROOT} from "../../shared/Params.ts";

const LOGIN_BUTTON_ID = "login-button";
const REGISTER_BUTTON_ID = "register-button";
const LOGOUT_BUTTON_ID = "logout-button";

const AGREE_RULES_ID="agree-rules";
const COMPLETE_REGISTER_ID="complete-registration";

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
          margin-right:2.85rem;
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
        console.log(event.target.id)

        if(targetId === AGREE_RULES_ID){
          self.updateData({
            [AGREE_RULES_ID]: event.target.checked,
          })
        }

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

        if (targetId === REGISTER_BUTTON_ID) {

          const formInputs = self.retrieveAndValidateFormInputs(shadowRoot)

          if (formInputs.errorMessage) {
            console.log(formInputs.errorMessage)
            formInputs.errorMessage
            self.updateData({
              "errorMessage": formInputs.errorMessage
            })

          } else {
            self.updateData({
              email: formInputs.username,
              errorMessage:"",
              isRegistering: true,
              password: formInputs.password
            })
          }
        }

        if (targetId === COMPLETE_REGISTER_ID){

          self.registerAttempted = true;

            const requestData = {
              email: self.componentStore.email,
              password: self.componentStore.password
            }

            ApiLoadAction.getResponseData({
              body: JSON.stringify(requestData),
              method: "POST",
              url: API_ROOT + `/users/register`,
            }).then((response:any)=>{

            if(response.errorMessage){
              self.updateData({
                "errorMessage":response.errorMessage
              })
            } else {
              self.updateData({
                [SUCCESS_MESSAGE_KEY]: "Successfully registered user"
              })
            }
          })
        }


        if (targetId === LOGOUT_BUTTON_ID) {
          LOGOUT_STORE.fetchData({}, LOGIN_STORE)
        }
      }catch(e:any){
        if(e.message !== `Permission denied to access property "id"`){
          throw e;
        }
      }
    })
  }

  render(data: any) {
    if(data.isRegistering){
      return this.generateRegisterUi(data)
    }
    return data[IS_LOGGED_IN_KEY] ?
        '' :
        this.generateLogin(data)
  }

  generateRegisterUi(data:any){


    return `
      ${data[SUCCESS_MESSAGE_KEY] ? generateSuccessMessage(data[SUCCESS_MESSAGE_KEY]) : `<p>Registering ${data.email}</p>`}
      
      ${this.loginAttempted || this.registerAttempted ? generateErrorMessage(data.errorMessage) : ''}

      <label for="${AGREE_RULES_ID}">I agree to the site rules listed below</label>
      <input type="checkbox" id="${AGREE_RULES_ID}" ${data[AGREE_RULES_ID] ? 'checked' : ''}>
      
      ${data[AGREE_RULES_ID]  ? generateButton({
        id: COMPLETE_REGISTER_ID,
        text:"Complete registration"
    }): `<button>Complete registration </button>`}
      <h1>Rules for creating events and groups </h1>

      <ul>
        <li>All events must be in person</li>
        <li>Any links posted in descriptions must be informational content relevant to an event such as a group website
            or details about a board game. Content must also be visible without logging in or entering personal information.</li>
        <li>Contact information including phone numbers or email addresses cannot be posted. Users are encouraged
        to share information in person at events.</li>
      </ul>
    `
  }
  generateLogin(data: any) {

    const message = new URLSearchParams(document.location.search).get("message")

    const html = `
      <label>${message  ? message.replaceAll("_"," "): ``}</label>
      <div class="ui-section" id="login-component-container">
      <form id=${LOGIN_FORM_ID}>
        <div class="ui-input">
        <label id="email">Email</label>
        <input        
          id=${USERNAME_INPUT}
        />
       </input>    
       
        <label>Password</label>
        <input        
          id=${PASSWORD_INPUT}
        />
       </input>    
       </div>
  
        <div id="component-buttons">
          ${generateButton({
            class: "login-element",
            id: LOGIN_BUTTON_ID,
            text: "Login",
            type: "submit",
          })}  
          ${generateButton({
            class: "login-element",
            id: REGISTER_BUTTON_ID,
            type: "submit",
            text: "Register",
          })}         
        </div>
          ${this.loginAttempted || this.registerAttempted ? generateErrorMessage(data.errorMessage) : ''}
        </form>
      </div>
    `;
    return html;
  }
}