import {LOGIN_THUNK} from "../../ui/auth/data/LoginThunk.ts";

//@ts-ignore
import {setupStateFields} from "../InitGlobalStateConfig.ts";
import {BaseTemplateDynamicComponent} from "../../framework/components/BaseTemplateDynamicComponent.ts";
import {LOGOUT_EVENT_CONFIG} from "../../ui/auth/LoginComponentEventHandlers.ts";
import {LOGOUT_THUNK} from "../../ui/auth/data/LogoutThunk.ts";
setupStateFields();

const loadConfig = {
  onLoadStoreConfig: {
    dataSource: LOGIN_THUNK,
    disableCache: true,
  },
  requestThunkReducers:[
    {
      thunk: LOGIN_THUNK,
      componentStoreReducer: function(data:any){
        return data;
      }
    },
    {
      thunk: LOGOUT_THUNK,
      componentStoreReducer: function(data:any){
        return data;
      }
    }
  ],
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
    super('login-status-component', loadConfig);
  }

  override getTemplateStyle(): string {
    return template;
  }

  override render(data:any){

    if(data.loggedIn){
      return `
        <span>Welcome ${data.data.user.email}</span>
        <a ${this.createClickEvent(LOGOUT_EVENT_CONFIG)}>Sign out</a>
      `

    }

    return `<a href="/login.html">Sign in </a>`;
  }
}

if (!customElements.get("login-status-component")) {
  customElements.define("login-status-component", LoginStatusComponent);
}