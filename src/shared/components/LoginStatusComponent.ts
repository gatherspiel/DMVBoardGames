
//@ts-ignore
import {LOGOUT_EVENT_CONFIG} from "../../ui/auth/LoginComponentEventHandlers.ts";

import {
  BaseTemplateDynamicComponent,
  GLOBAL_STATE_LOAD_CONFIG_KEY
} from "@bponnaluri/places-js";
import {LOGIN_THUNK} from "../../ui/auth/data/LoginThunk.ts";

const loadConfig = {
  [GLOBAL_STATE_LOAD_CONFIG_KEY]: {
    dataThunks:[{
      dataThunk: LOGIN_THUNK
    }]
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

    if(data.loggedIn){
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