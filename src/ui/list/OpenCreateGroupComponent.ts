import {IS_LOGGED_IN_KEY} from "../../shared/Constants.ts";

import {BaseDynamicComponent} from "@bponnaluri/places-js";
import {LOGIN_STORE} from "../../data/auth/LoginStore.ts";

export class OpenCreateGroupComponent extends BaseDynamicComponent {

  constructor() {
    super([{
      componentReducer:(data:any)=>{
        return {
          [IS_LOGGED_IN_KEY]: data?.loggedIn
        }
      },
      dataStore:LOGIN_STORE
    }]);
  }

  override getTemplateStyle():string{
    return `  
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
        a {
          color: white;
          text-decoration: none;
        }    
      </style>`
  }

  render(data: any){
    const url = data[IS_LOGGED_IN_KEY] ?
      `html/groups/create.html` :
      `/html/users/createAccount.html?message=Register_an_account_and_log_in_to_create_a_group`

    return `
        <a href ="${url}">Create group</a>`

  }
}
