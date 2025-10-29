import {LOGIN_STORE,} from "./data/LoginStore.ts";
import {LOGIN_FORM_ID, PASSWORD_INPUT, USERNAME_INPUT,} from "./Constants.js";
import {
  SUCCESS_MESSAGE_KEY,
} from "../../shared/Constants.ts";
import {
  ApiLoadAction,
  BaseDynamicComponent,
} from "@bponnaluri/places-js";
import {generateErrorMessage, generateSuccessMessage} from "../../shared/html/StatusIndicators.ts";
import {generateButton, generateDisabledButton} from "../../shared/html/ButtonGenerator.ts";
import {API_ROOT} from "../../shared/Params.ts";

import {SiteRulesComponent} from "../../shared/html/SiteRulesComponent.ts";
import {FaqComponent} from "../../shared/html/FaqComponent.ts";
customElements.define("site-rules-component", SiteRulesComponent);
customElements.define("faq-component",FaqComponent);

const CONFIRM_PASSWORD_INPUT = "confirm-password-input";
const AGREE_RULES_ID="agree-rules";
const CREATE_ACCOUNT_ID="complete-registration";
const CREATE_ACCOUNT_ID_DISABLED="complete-registration-disabled";
export class CreateAccountComponent extends BaseDynamicComponent {

  constructor() {
    super([{
      componentReducer:(loginState:any)=>{
        if(loginState.loggedIn){
          window.location.assign(window.location.origin);
        }
        const errorMessage =
          (new URLSearchParams(document.location.search))?.get("message")?.replaceAll("_"," ")
          ?? ""

        return {
          ...loginState,
          confirmPassword:'',
          errorMessage:errorMessage,
          password: '',
          username: '',
        }
      },
      dataStore: LOGIN_STORE,
    }]);
  }

  override getTemplateStyle(): string {
    return `  
      <link rel="stylesheet" type="text/css"  href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>

        #email {
          display: inline-block;
        }
        #component-buttons {
          padding-top:0.5rem;
        }  
        #login-component-container {
          padding-top: 0.25rem;
        }  
        #ui-input input {
          display: block;
        }
        .${CREATE_ACCOUNT_ID},.${CREATE_ACCOUNT_ID_DISABLED}{
          margin-top:0.5rem;
        }
        #${CREATE_ACCOUNT_ID}{
          display:block;
        }
        
        #${CREATE_ACCOUNT_ID_DISABLED} .front {
          background: gray;
        }
        .ui-input {
          display: block;
        }  
        @media not screen and (width < 32em) {
          h1 {
            margin-left: 1.5rem;
          }
          #email {
            display: inline-block;
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

  override attachHandlersToShadowRoot(shadowRoot:ShadowRoot){

    const self = this;
    shadowRoot?.addEventListener("click",(event:any)=>{
      event.preventDefault();

        const targetId = event.target?.id;
        if(targetId === AGREE_RULES_ID){

          self.updateData({
            [AGREE_RULES_ID]: event.target.checked,
            confirmPassword: (shadowRoot.getElementById(CONFIRM_PASSWORD_INPUT) as HTMLInputElement)?.value,
            password: (shadowRoot.getElementById(PASSWORD_INPUT) as HTMLInputElement)?.value,
            username: (shadowRoot.getElementById(USERNAME_INPUT) as HTMLInputElement)?.value,
          })
        }

        if (targetId === CREATE_ACCOUNT_ID){

          const formData = {
            username: (shadowRoot.getElementById(USERNAME_INPUT) as HTMLInputElement)?.value,
            password:(shadowRoot.getElementById(PASSWORD_INPUT) as HTMLInputElement)?.value,
            confirmPassword: (shadowRoot.getElementById(CONFIRM_PASSWORD_INPUT) as HTMLInputElement)?.value
          }

          if (!formData.username || (!formData.password && !formData.confirmPassword)) {
            self.updateData({...formData,
              errorMessage: "Enter a valid username and password"
            })
            return;
          }

          if(formData.password !== formData.confirmPassword) {
            self.updateData({...formData,
              errorMessage: "Passwords must match"
            })
            return;
          }

          ApiLoadAction.getResponseData({
            body: JSON.stringify({email:formData.username,password:formData.password}),
            method: "POST",
            url: API_ROOT + `/user/register`,
          }).then((response:any)=>{

            if(response.errorMessage){
              self.updateData({
                ...formData,
                "errorMessage":response.errorMessage,
                "successMessage":"",
              })
            } else {
              self.updateData({
                [SUCCESS_MESSAGE_KEY]: `
                  Successfully created account. Check your email for a message to confirm and
                  activate your account.`,
                errorMessage: ''
              })
            }
          })
        }
    })
  }

  render(data: any) {

    return `
      <h1>Create account</h1>
      <div class="ui-section" id="login-component-container">
        <form id=${LOGIN_FORM_ID}>
          <div id="ui-input">
            <label class="" id="email">Email</label>
            <input        
              id=${USERNAME_INPUT}
              type="email"
              value="${data.username}"
            />
           </input>    
          <label class="">Password</label>
          <input        
            id=${PASSWORD_INPUT}
            type="password"
            value="${data.password}"
          />
          </input>
          <label class="">Confirm password</label>
          <input        
            id=${CONFIRM_PASSWORD_INPUT}
            type="password"
            value="${data.confirmPassword}"
          />
          </input>    
         </div>
  
          ${generateErrorMessage(data.errorMessage) }
          ${generateSuccessMessage(data[SUCCESS_MESSAGE_KEY])}

          ${data[AGREE_RULES_ID]  ? generateButton({
            class: CREATE_ACCOUNT_ID,
            id: CREATE_ACCOUNT_ID,
            text:"Create account"
          }):
          generateDisabledButton({
            class: CREATE_ACCOUNT_ID_DISABLED,
            id: CREATE_ACCOUNT_ID_DISABLED,
            text:"Create account"
          })}
          
          <div id="agree-rules-input">
            <label for="${AGREE_RULES_ID}">I agree to the site rules listed below</label>
            <input type="checkbox" id="${AGREE_RULES_ID}" ${data[AGREE_RULES_ID] ? 'checked' : ''}>         
          </div>
          <site-rules-component></site-rules-component>
          <faq-component></faq-component>
        </form>
      </div>
    `;
  }


}