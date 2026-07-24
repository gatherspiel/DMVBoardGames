import { IS_LOGGED_IN_KEY, LOGIN_STORE } from "../../data/user/LoginStore.js";
import { BaseDynamicComponent } from "/lib/places-js-latest.js";

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


  getLinks(data) {
    return `
      <a class="btn secondary" href="${data.url}">Create group</a>
      <a class="btn secondary" href="/html/user/memberData.html">View my groups and events</a>
    `;
  }

  render(data) {
    if (!data[IS_LOGGED_IN_KEY]){
      return ``;
    }
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
