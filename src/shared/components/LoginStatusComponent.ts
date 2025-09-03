import {
  BaseDynamicComponent,
} from "@bponnaluri/places-js";
import {LOGIN_STORE} from "../../ui/auth/data/LoginStore.ts";
import {LOGOUT_STORE} from "../../ui/auth/data/LogoutStore.ts";

const loadConfig = [{
      dataStore: LOGIN_STORE
    }]


const template = `
   
  <style>
  
  a {
    color: white;
    font-size: 1.5rem;
    font-weight: 400;
    text-decoration: none;
  }
  
  span {
    font-weight: 400;
  }
  
  a:hover {
    background-color: var(--clr-darker-blue);
  }
  
  div {
    padding-top:0.5rem;
    font-size: 1.5rem;
    color:var(--clr-darker-blue)
  }
  
  button {
    font-size: 1.5rem;
  }
  
  button:active {
    background-color: var(--clr-darker-blue) !important;
  }
  
      
  @media not screen and (width < 32em) {
    div {
      padding-left:1rem;
    }
  }

  </style>
`

const SIGN_OUT_LINK_ID = "signout-link"
export class LoginStatusComponent extends BaseDynamicComponent {

  constructor() {
    super(loadConfig);
  }

  override getTemplateStyle(): string {
    return template;
  }

  override attachEventHandlersToDom(shadowRoot?: any){
    shadowRoot?.getElementById(SIGN_OUT_LINK_ID)?.addEventListener("click",()=>{
      LOGOUT_STORE.fetchData({}, LOGIN_STORE)
    });
  }

  override render(authData:any){
    if(authData.loggedIn){
      return `
        <div>
          <span>Welcome ${authData.data.user.email}</span>
          <a id="${SIGN_OUT_LINK_ID}">Sign out</a>   
        </div>

      `
    }
    return `<a href="/login.html">Sign in </a>`;
  }
}

