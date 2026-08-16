import { BaseDynamicComponent } from "/lib/places-js-latest.js";
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
    this.addEventListener("click", (event) => {
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
