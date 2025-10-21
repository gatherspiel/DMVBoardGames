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
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>

      <style>
        a {
          color: white;
          text-decoration: none;;
        }
        @media not screen and (width < 32em) {
          a {
            margin-left:2rem;
          }
          p {
            display: inline-block;
          }
          #links-container div{
            display: inline-block;
          }
          #user-text-container {
            text-align: right;
          }
          #user-text {
            font-size:1rem;
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
          a {
            display: block;
            line-height: 1.25;
            margin-bottom:0.5rem;
          }
          #user-text-container {
            margin-bottom:1.5rem;
          }
          #user-text {
            margin-top:1rem;
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
      <div id="login-status-container">
        <div id="links-container">
                <div id="${SIGN_OUT_LINK_ID}">Sign out</div>
          <div><a href="/beta/editProfile.html">Edit profile</a></div>
        </div>
        <div id="user-text-container">

          <p id="user-text">${authData.data.user.email}</p>
        </div>
  </div>
      `
    }
    return `
      <a href="/beta/login.html">Login</a>
      <a href="/beta/createAccount.html">Create account</a>
    `;
  }
}

