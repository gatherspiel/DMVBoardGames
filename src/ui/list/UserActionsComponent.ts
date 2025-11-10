import {BaseDynamicComponent} from "@bponnaluri/places-js";
import {IS_LOGGED_IN_KEY, LOGIN_STORE} from "../../data/user/LoginStore.ts";

export class UserActionsComponent extends BaseDynamicComponent {

  constructor() {
    super([{
      componentReducer:(data:any)=>{
        const url = data[IS_LOGGED_IN_KEY] ?
          `/html/groups/create.html` :
          `/html/user/createAccount.html?message=Register_an_account_and_log_in_to_create_a_group`
        return {
          [IS_LOGGED_IN_KEY]: data[IS_LOGGED_IN_KEY],
          url: url
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

  getLinks(data: any){


    let html = `
      <a href ="${data.url}">Create group</a>
    `

    console.log(data);
    if(data[IS_LOGGED_IN_KEY]){
      html += `<a href="/html/user/memberData.html">View my groups and events</a>`
    }

    return html;
  }

  override render(data:any){
    return `
      <div class="top-nav-secondary">
        ${this.getLinks(data)}
      </div>
    `
  }
}
