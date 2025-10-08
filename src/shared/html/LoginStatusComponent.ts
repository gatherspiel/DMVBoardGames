import {
  BaseDynamicComponent,
} from "@bponnaluri/places-js";
import {LOGIN_STORE} from "../../ui/auth/data/LoginStore.ts";
import {LOGOUT_STORE} from "../../ui/auth/data/LogoutStore.ts";
import {generateLinkButton} from "./ButtonGenerator.ts";

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
          div {
            margin-left: 1rem;
          }
          .raised {
            display: inline-block;
          }
        }
        @media screen and (width < 32em) {
          p {
            margin-top:0;
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
        ${generateLinkButton({
          text: "Sign out",
          url: SIGN_OUT_LINK_ID
        })}
      `
    }
    return `
      ${generateLinkButton({
        text: "Sign in",
        url: "/beta/login.html"
      })}
    `;
  }
}

