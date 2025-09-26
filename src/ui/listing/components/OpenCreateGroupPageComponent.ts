import {generateLinkButton} from "../../../shared/components/ButtonGenerator.ts";
import {IS_LOGGED_IN_KEY} from "../../../shared/Constants.ts";

import {BaseDynamicComponent} from "@bponnaluri/places-js";
import {LOGIN_STORE} from "../../auth/data/LoginStore.ts";

export class OpenCreateGroupPageComponent extends BaseDynamicComponent {

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
        .raised {
          line-height: 1;
          margin-left: 1rem;
          margin-bottom: 0.5rem;
        }
        @media not screen and (width < 32em) {
         .raised {
            display: inline-block;
          }
        }
        
        @media screen and (width < 32em) {
         .raised {
            margin-left: 2rem;
            margin-right:2rem;
          }
        }      
      </style>`
  }

  render(data: any){
    console.log("Hi")
    const url = data[IS_LOGGED_IN_KEY] ?
      `beta/create.html` :
      `beta/login.html?message=Register_an_account_and_log_in_to_create_a_group`

    return `
        ${generateLinkButton({
            text: "Create group",
            url: url
          })}
        
        <div class="section-separator-small"></div>
      `

  }
}
