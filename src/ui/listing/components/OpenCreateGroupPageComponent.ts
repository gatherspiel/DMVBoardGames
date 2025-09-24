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
    if(!data[IS_LOGGED_IN_KEY]){
      return ''
    }
    return `
        ${generateLinkButton({
          text: "Create group",
          url:`groups/create.html`
        })}
        <div class="section-separator-small"></div>
    `
  }
}
