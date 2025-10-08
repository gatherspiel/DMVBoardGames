import {
  BaseDynamicComponent,
} from "@bponnaluri/places-js";
import {LOGIN_STORE} from "../../ui/auth/data/LoginStore.ts";
import {LOGOUT_STORE} from "../../ui/auth/data/LogoutStore.ts";

const SIGN_OUT_LINK_ID = "signout-link"
export class LoginStatusComponent extends BaseDynamicComponent {

  constructor() {
    super([{
        dataStore: LOGIN_STORE
      }]
    );
  }

  override getTemplateStyle(): string {
    return `
      <style>
        a {
          color: white;
          font-size: 1.5rem;
          font-weight: 400;
          text-decoration: none;
        }
        a:hover {
          background-color: var(--clr-darker-blue);
        }
    
        span {
          font-weight: 400;
        } 
        
        @media not screen and (width < 32em){
          div {
            padding-top:0.25rem;
          }
        }
        
        @media screen and (width < 32em) {    
          div {
            padding-top:0.5rem;
          } 
          div {
            padding-bottom: 0.25rem;
          }
        }
      </style>
    `;
  }

  override attachHandlersToShadowRoot(shadowRoot?: any){
    shadowRoot.addEventListener("click",(event:any)=>{
      if(event.target.id === SIGN_OUT_LINK_ID) {
        LOGOUT_STORE.fetchData({}, LOGIN_STORE)
      }
    })
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
    return `<div><a href="/beta/login.html">Sign in </a></div>`;
  }
}

