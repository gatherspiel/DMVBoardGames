import { BaseDynamicComponent } from "@bponnaluri/places-js";
import { LOGIN_STORE } from "../../data/user/LoginStore.js";
import { LOGOUT_STORE } from "../../data/user/LogoutStore.js";
import { USER_DATA_STORE } from "../../data/user/UserDataStore.js";
const SIGN_OUT_LINK_ID = "signout-link";

export class LoginStatusComponent extends BaseDynamicComponent {
  constructor() {
    super([
      {
        dataStore: LOGIN_STORE,
      },
    ]);
  }

  getTemplateStyle() {
    return `	
			<link rel="stylesheet" type="text/css" href="/styles/kelp.css"/>
			<style>
			</style>`;
  }

  render(authData) {
    if (!authData.loggedIn) {
      return `
				<a class="btn secondary" href="/html/user/login.html">Login</a>
				&nbsp 
				<a class="btn secondary" href="/html/user/createAccount.html">New account</a>
				`;
    }

    return `
      <login-status-component-inner
        email="${authData.data.user.email}"
      ></login-status-component-inner>`;
  }
}

class LoginStatusComponentInner extends BaseDynamicComponent {
  constructor() {
    super([
      {
        dataStore: USER_DATA_STORE,
      },
    ]);
  }

  getTemplateStyle() {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/kelp.css"/>
			<link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
        #user-image-icon {
          clip-path: circle();
          height:2rem;
        }
				.navbar {
					padding:0;
				}
				@media not screen and (width < 32em) {
          a {
            margin-left:0.75rem;
						margin-right:0.75rem;
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
						max-height:2rem;	
						vertical-align:center;
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
					#signout-link {
						margin-top:0.5rem;
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

  attachHandlersToShadowRoot(shadowRoot) {
    shadowRoot.addEventListener("click", (event) => {
      if (event.target.id === SIGN_OUT_LINK_ID) {
        LOGOUT_STORE.fetchData({}, LOGIN_STORE);
      }
    });
  }

  render(userData) {
		return `
      <div id="login-status-container">

				<div class="btn secondary" id="${SIGN_OUT_LINK_ID}">Sign out</div>
				<a class="btn secondary" href="/html/user/editProfile.html">Edit profile</a>
				<span>${userData.username || this.getAttribute("email")}</span>
			  ${userData.imageFilePath ? `<div id="user-image-container"><img class="avatar" id="user-image-icon" src="${userData.imageFilePath}"/></div>` : ``}

				</div>
      </div>
    `;
  }
}

customElements.define(
  "login-status-component-inner",
  LoginStatusComponentInner,
);
