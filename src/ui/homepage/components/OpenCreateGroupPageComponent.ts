import {generateLinkButton} from "../../../shared/components/ButtonGenerator.ts";
import {IS_LOGGED_IN_KEY} from "../../../shared/Constants.ts";

import {BaseDynamicComponent} from "@bponnaluri/places-js";
import {LOGIN_STORE} from "../../auth/data/LoginStore.ts";


const loadConfig = [{
      componentReducer:(data:any)=>{
        return {
          [IS_LOGGED_IN_KEY]: data?.loggedIn
        }
      },
      dataStore:LOGIN_STORE
    }]


export class OpenCreateGroupPageComponent extends BaseDynamicComponent {

  constructor() {
    super(loadConfig);
  }

  override getTemplateStyle():string{
    return `  
      <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>
      <style>
      
      #open-create-group-div {
        border-bottom:  5px solid;
        border-image-source: url(assets/Section_Border_Tiny.png);
        border-image-slice: 5 5;
        border-image-repeat: round;
      }
      
      
        .homepage-default-action-div {
          display:flex;
          align-items: center;
        }
        
        .homepage-default-action-div img {
          padding-top:20px;
          padding-right:0.5rem;
        }
      .raised {
        display: inline-block;
        line-height: 1;
      }
            
      </style>`
  }


  render(data: any){
    if(!data[IS_LOGGED_IN_KEY]){
      return ''
    }
    return `
        <div id="open-create-group-div" class= "homepage-default-action-div">
        ${generateLinkButton({
          text: "Create group",
          url:`groups/create.html`
        })}
        </div>
    `
  }
}

if (!customElements.get("open-create-group-component")) {
  customElements.define("open-create-group-component", OpenCreateGroupPageComponent);
}