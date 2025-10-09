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
import {getFaqRulesHtml, getMainSiteRulesHtml} from "../../shared/html/SiteRules.ts";

const CONFIRM_PASSWORD_INPUT = "confirm-password-input";
const AGREE_RULES_ID="agree-rules";
const COMPLETE_REGISTER_ID="complete-registration";
const COMPLETE_REGISTER_ID_DISABLED="complete-registration-disabled";
export class CreateAccountComponent extends BaseDynamicComponent {

  loginAttempted: boolean;
  registerAttempted: boolean;
  constructor() {
    super([{
      componentReducer:(loginState:any)=>{
        if(loginState.loggedIn){
          window.location.assign(window.location.origin);
        }
        return {
          ...loginState,
          username: '',
          password: '',
          confirmPassword:''
        };
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
        #ui-input input {
          display: block;
        }
        #component-buttons {
          padding-top:0.5rem;
        }   
        .ui-input {
          display: block;
        }
        #email {
          display: inline-block;
        }
        #${COMPLETE_REGISTER_ID}{
          display:block;
        }
        
        #${COMPLETE_REGISTER_ID_DISABLED} .front {
          background: gray;
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

  retrieveAndValidateFormInputs(shadowRoot:ShadowRoot) {

    const username = (shadowRoot.getElementById(USERNAME_INPUT) as HTMLInputElement)?.value;
    const password = (shadowRoot.getElementById(PASSWORD_INPUT) as HTMLInputElement)?.value;
    const confirmPassword = (shadowRoot.getElementById(CONFIRM_PASSWORD_INPUT) as HTMLInputElement)?.value;

    if (!username || (!password && !confirmPassword)) {
      return {
        errorMessage: "Enter a valid username and password"
      }
    }

    if(password !== confirmPassword) {
      return {
        errorMessage: "Passwords must match"
      }
    }

    return {
      confirmPassword: confirmPassword,
      password: password,
      username: username,
    };
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

        if (targetId === COMPLETE_REGISTER_ID){
          self.registerAttempted = true;

          const formData = {
            username: (shadowRoot.getElementById(USERNAME_INPUT) as HTMLInputElement)?.value,
            password:(shadowRoot.getElementById(PASSWORD_INPUT) as HTMLInputElement)?.value,
            confirmPassword: (shadowRoot.getElementById(CONFIRM_PASSWORD_INPUT) as HTMLInputElement)?.value
          }

          if (!formData.username || (!formData.password && !formData.confirmPassword)) {
            self.updateData({...formData,
              errorMessage: "Enter a valid username and password"
            })
          }

          if(formData.password !== formData.confirmPassword) {
            self.updateData({...formData,
              errorMessage: "Passwords must match"
            })
          }

          ApiLoadAction.getResponseData({
            body: JSON.stringify({email:formData.username,password:formData.password}),
            method: "POST",
            url: API_ROOT + `/users/register`,
          }).then((response:any)=>{

            if(response.errorMessage){
              self.updateData({
                ...formData,
                "errorMessage":response.errorMessage,
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
            <label class="form-field-header" id="email">Email</label>
            <input        
              id=${USERNAME_INPUT}
              type="email"
              value="${data.username}"
            />
           </input>    
          <label class="form-field-header">Password</label>
          <input        
            id=${PASSWORD_INPUT}
            type="password"
            value="${data.password}"
          />
          </input>
          <label class="form-field-header">Confirm password</label>
          <input        
            id=${CONFIRM_PASSWORD_INPUT}
            type="password"
            value="${data.confirmPassword}"
          />
          </input>    
         </div>
  
          ${this.registerAttempted ? generateErrorMessage(data.errorMessage) : ''}
          ${this.registerAttempted ? generateSuccessMessage(data[SUCCESS_MESSAGE_KEY]) : ''}

          ${data[AGREE_RULES_ID]  ? generateButton({
            id: COMPLETE_REGISTER_ID,
            text:"Create account"
          }):
          generateDisabledButton({
            id: COMPLETE_REGISTER_ID_DISABLED,
            text:"Create account"
          })}
          
          <div id="agree-rules-input">
            <label for="${AGREE_RULES_ID}">I agree to the site rules listed below</label>
            <input type="checkbox" id="${AGREE_RULES_ID}" ${data[AGREE_RULES_ID] ? 'checked' : ''}>         
          </div>

          
          ${getMainSiteRulesHtml()}
          ${getFaqRulesHtml()}
        </form>
      </div>
    `;
  }


}