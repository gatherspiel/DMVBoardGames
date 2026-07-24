import { LOGIN_FORM_ID, PASSWORD_INPUT, USERNAME_INPUT } from "./Constants.js";
import { BaseDynamicComponent } from "/lib/places-js-latest.js";
import { LOGIN_STORE } from "../../data/user/LoginStore.js";

const LOGIN_BUTTON_ID = "login-button";

export class LoginComponent extends BaseDynamicComponent {
  loginAttempted;
  registerAttempted;
  constructor() {
    super([
      {
        componentReducer: (loginState) => {
          if (loginState.loggedIn) {
            window.location.assign("/html/user/memberData.html");
          }
          return loginState;
        },
        dataStore: LOGIN_STORE,
      },
    ]);
    this.loginAttempted = false;
    this.registerAttempted = false;

    const self = this;
    this.addEventListener("click", (event) => {
      event.preventDefault();

      try {
        const targetId = event.target?.id;
        if (targetId === LOGIN_BUTTON_ID) {
          self.loginAttempted = true;
          const formInputs = self.retrieveAndValidateFormInputs(self.getRootNode());
          if (formInputs.errorMessage) {
            self.updateData(formInputs);
          } else {
            LOGIN_STORE.fetchData({
              formInputs,
            });
          }
        }
      } catch (e) {
        if (e.message !== `Permission denied to access property "id"`) {
          throw e;
        }
      }
    });


  }

  retrieveAndValidateFormInputs(rootNode) {
    const username = rootNode.getElementById(USERNAME_INPUT)?.value;
    const password = rootNode.getElementById(PASSWORD_INPUT)?.value;
    if (!username || !password) {
      return {
        errorMessage: "Enter a valid username and password",
      };
    }
    return {
      username: username,
      password: password,
    };
  }

  render(data) {
    const isNewUser = new URLSearchParams(document.location.search).get(
      "newUser",
    );

    return `
      <div class="container-xl" id="login-component-container">
        <form id=${LOGIN_FORM_ID}>
        ${isNewUser ? `<h2 class="success-message">Account successfully confirmed. Use this page to login. </h2>` : ``}
          <div class="ui-input">
            <div class="form-section">
              <label class="required-field" id="email">Email</label>
            <input        
              id=${USERNAME_INPUT}
              type="email"
            />     
            </input>    
          </div>
          <div class="form-section">
          <label class="required-field">Password</label>
            <input        
              id=${PASSWORD_INPUT}
              type="password"
            />
            </input> 
          </div>
        </div>       
        <div id="component-buttons">
          <button class="primary" type="submit" id=${LOGIN_BUTTON_ID}>Login</button>   
          </div>
            ${this.loginAttempted || this.registerAttempted ? `<div class="validation-error">${data.errorMessage}</div>`: ""}
          </form>
        </div>
    `;
  }
}
