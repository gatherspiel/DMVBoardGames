import {
  BaseDynamicComponent,
} from "@bponnaluri/places-js";
import {LOGIN_STORE} from "../../ui/auth/data/LoginStore.ts";
import {LOGOUT_STORE} from "../../ui/auth/data/LogoutStore.ts";
import {generateButton, generateLinkButton} from "./ButtonGenerator.ts";

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
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>

      <style>
         @media not screen and (width < 32em) {
          p {
            display: inline-block;
          }
          .raised {
            display: inline-block;
          }
        }
        @media screen and (width < 32em) {
          p {
            margin-top:0;
          }
          .raised {
            margin-top:0.5rem;
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
        <p id="user-text">Welcome ${authData.data.user.email}</p>
        ${generateButton({
          id: SIGN_OUT_LINK_ID,
          text: "Sign out",
        })}
      `
    }
    return `
      ${generateLinkButton({
        text: "Login",
        url: "/beta/login.html"
      })}
      ${generateLinkButton({
        text: "Create account",
        url: "/beta/createAccount.html"
      })}
    `;
  }
}

