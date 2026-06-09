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
      <link rel="stylesheet" type="text/css" href="/styles/kelp.css"/>
			<style>
        a {
          color: white;
          text-decoration: none;
        } 
				.container-xl {
					margin-top: -1.5em;
				}
				@media screen and (width < 32em) {	
					.container-xl > div {
						display:flex;
						justify-content:center;
						align-items:center;		
					}
				}	
      </style>`;
  }

  getLinks(data) {
    let html = `
      <a class="btn secondary" href="${data.url}">Create group</a>
    `;

    if (data[IS_LOGGED_IN_KEY]) {
      html += `<a href="/html/user/memberData.html">View my groups and events</a>`;
    }

    return html;
  }

  render(data) {
    return `
      <div class="container-xl">
				<div> 
				${this.getLinks(data)}  
				</div>	
				<hr>
		 </div>
		`;
  }
}
