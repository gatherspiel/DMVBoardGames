import {LOGIN_STORE,} from "./data/LoginStore.ts";
import {LOGOUT_STORE} from "./data/LogoutStore.ts";
import {LOGIN_FORM_ID, PASSWORD_INPUT, USERNAME_INPUT,} from "./Constants.js";
import {
  IS_LOGGED_IN_KEY,
  SUCCESS_MESSAGE_KEY
} from "../../shared/Constants.ts";
import {
  BaseDynamicComponent,
  ApiLoadAction,
} from "@bponnaluri/places-js";
import {generateErrorMessage} from "../../shared/components/StatusIndicators.ts";
import {generateButton} from "../../shared/components/ButtonGenerator.ts";
import {API_ROOT} from "../../shared/Params.ts";

//TODO: Refactor CSS to use fix widths on labels in the future instead of having a hardcoded margin on the email label.

const template = `
  <link rel="stylesheet" type="text/css"  href="/styles/sharedHtmlAndComponentStyles.css"/>

  <style>
    #login-component-container {
      padding-top: 0.25rem;
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

  </style>

`;

const LOGIN_BUTTON_ID = "login-button";
const REGISTER_BUTTON_ID = "register-button";
const LOGOUT_BUTTON_ID = "logout-button";

export class LoginComponent extends BaseDynamicComponent {

  loginAttempted: boolean;

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

        if (targetId === REGISTER_BUTTON_ID) {
          const formInputs = self.retrieveAndValidateFormInputs(shadowRoot)
          if(formInputs.errorMessage){
            self.updateData(formInputs)
          } else {

            console.log("Registering user")

            const requestData = {
              email: formInputs.username,
              password: formInputs.password
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
  override getTemplateStyle(): string {
    return template;
  }

  render(data: any) {
    return data[IS_LOGGED_IN_KEY] ?
        '' :
        this.generateLogin(data)
  }
  generateLogin(data: any) {

    const html = `
     <div class="ui-section" id="login-component-container">
      <form id=${LOGIN_FORM_ID}>
        <div class="ui-input">
        <label id="email">Email</label>
        <input        
          id=${USERNAME_INPUT}
        />
       </input>    
       <br>
       
        <label>Password</label>
        <input        
          id=${PASSWORD_INPUT}
        />
       </input>    
       </div>
       <br>            
  

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
          ${this.loginAttempted ? generateErrorMessage(data.errorMessage) : ''}
        </form>

    </div>
    `;
    return html;
  }
}