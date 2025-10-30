import {
  BaseDynamicComponent,
} from "@bponnaluri/places-js";
import {LOGIN_STORE} from "../../data/auth/LoginStore.ts";
import {LOGOUT_STORE} from "../../data/auth/LogoutStore.ts";
import {USER_DATA_STORE} from "../../data/auth/UserDataStore.ts";
const SIGN_OUT_LINK_ID = "signout-link"

export class LoginStatusComponent extends BaseDynamicComponent {
  constructor() {
    super([{
        dataStore: LOGIN_STORE,
      }]
    );
  }

  override getTemplateStyle(): string {
    return `<style>
       a {
        color: white;
        text-decoration: none;;
      }
      @media not screen and (width < 32em) {
        a {
          margin-left:2rem;
        }
      }
      @media screen and (width < 32em) {
        a {
          display: block;
          line-height: 1.25;
          margin-bottom:0.5rem;
        }
      }
    </style>`
  }

  render(authData: any): string {

    if (!authData.loggedIn) {
      return `
        <a href="/html/user/login.html">Login</a>
        <a href="/html/user/createAccount.html">Create account</a>
      `
    }

    return `
      <login-status-component-inner
        email="${authData.data.user.email}"
      ></login-status-component-inner>`
  }
}


class LoginStatusComponentInner extends BaseDynamicComponent {
  constructor() {
    super([{
        dataStore: USER_DATA_STORE,
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
        #user-image-icon {
          clip-path: circle();
          height:3rem;
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
            margin-top:0.5rem;
            text-align: right;
          }
          #user-text {
            font-size:1rem;
          }
          #user-image-container, #username-container {
            display: inline-block;
          }
          #username-container {
            font-size:1rem;
            margin-left: 1rem;
            padding-top:1rem;
          }
          #user-text-container-filler {
            flex-grow:1;
          }
          #user-text-container-inner {
            display: flex;
          }
          .raised {
            display: inline-block;
          }
        }
        @media screen and (width < 32em) {
          p {
            margin-top:0;
          }
          a {
            display: block;
            line-height: 1.25;
            margin-bottom:0.5rem;
          }
          #edit-profile-div {
            margin-top:0.5rem;
          }
          #user-text-container {
            margin-bottom:1.5rem;
          }
          #user-text {
            margin-top:1rem;
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

  override render(userData:any){
    return `
      <div id="login-status-container">
        <div id="links-container">
          <div id="${SIGN_OUT_LINK_ID}">Sign out</div>
          <div id="edit-profile-div"><a href="/html/user/editProfile.html">Edit profile</a></div>
        </div>
        <div id="user-text-container">
          <div id="user-text-container-inner">
              <div id="user-text-container-filler"></div>
              <div id="user-image-container">
                ${userData.imageFilePath ? `<img id="user-image-icon" src="${userData.imageFilePath}"></img>` : ``}
              </div>
              <div id="username-container">
                <span>${userData.username || this.getAttribute("email")}</span>
              </div>
          </div>
        </div>
      </div>
    `
  }
}

customElements.define("login-status-component-inner",LoginStatusComponentInner)
