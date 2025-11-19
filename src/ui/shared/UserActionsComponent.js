import { IS_LOGGED_IN_KEY, LOGIN_STORE } from "../../data/user/LoginStore.js";
import { BaseDynamicComponent } from "@bponnaluri/places-js";

export class UserActionsComponent extends BaseDynamicComponent {
  constructor() {
    super([
      {
        componentReducer: (data) => {
          const url = data[IS_LOGGED_IN_KEY]
            ? `/html/groups/create.html`
            : `/html/user/createAccount.html?message=Register_an_account_and_log_in_to_create_a_group`;
          return {
            [IS_LOGGED_IN_KEY]: data[IS_LOGGED_IN_KEY],
            url: url,
          };
        },
        dataStore: LOGIN_STORE,
      },
    ]);
  }

  getTemplateStyle() {
    return `  
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
        a {
          color: white;
          text-decoration: none;
        }    
      </style>`;
  }

  getLinks(data) {
    let html = `
      <a href ="${data.url}">Create group</a>
    `;

    if (data[IS_LOGGED_IN_KEY]) {
      html += `<a href="/html/user/memberData.html">View my groups and events</a>`;
    }

    return html;
  }

  render(data) {
    return `
      <div class="top-nav-secondary">
        ${this.getLinks(data)}
      </div>
    `;
  }
}
