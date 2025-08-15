
//@ts-ignore
import {setupStateFields} from "../InitGlobalStateConfig.ts";
import {BaseTemplateDynamicComponent} from "../../framework/components/BaseTemplateDynamicComponent.ts";
import {LOGOUT_EVENT_CONFIG} from "../../ui/auth/LoginComponentEventHandlers.ts";
import {
  GLOBAL_FIELD_SUBSCRIPTIONS_KEY,
  GLOBAL_STATE_LOAD_CONFIG_KEY,
} from "../../framework/components/types/ComponentLoadConfig.ts";
import {IS_LOGGED_IN_KEY} from "../Constants.ts";
setupStateFields();

const loadConfig = {
  [GLOBAL_STATE_LOAD_CONFIG_KEY]: {
    [GLOBAL_FIELD_SUBSCRIPTIONS_KEY]: [IS_LOGGED_IN_KEY],
    defaultGlobalStateReducer: (data:any)=>{

      if(!data.isLoggedIn){
        return {
          isLoggedIn: false
        };
      }
      return data.isLoggedIn
    }
  },
}

const template = `
   
  <style>
  
  a {
    border-color: var(--clr-darker-blue);
    border-width: 1px;
    color: white;
    font-size: 1.5rem;
    font-weight: 400;
    margin-top: 0.5rem;
    padding: 0.5rem;
    text-decoration: none;
  }
  
  span {
    font-weight: 400;
  }
  
  a:hover {
    background-color: var(--clr-darker-blue);
  }
  
  div {
    padding-top:0.25rem;
    font-size: 1.5rem;
    color:var(--clr-darker-blue)
  }
  
  button {
    font-size: 1.5rem;
  }
  
  button:active {
    background-color: var(--clr-darker-blue) !important;
  }

  </style>

`
export class LoginStatusComponent extends BaseTemplateDynamicComponent {

  constructor() {
    super(loadConfig);
  }

  override getTemplateStyle(): string {
    return template;
  }

  override render(data:any){
    if(data.isLoggedIn){
      return `
        <span>Welcome ${data?.username}</span>
        <a ${this.createEvent(LOGOUT_EVENT_CONFIG, "click")}>Sign out</a>
      `
    }
    return `<a href="/login.html">Sign in </a>`;
  }
}

if (!customElements.get("login-status-component")) {
  customElements.define("login-status-component", LoginStatusComponent);
}