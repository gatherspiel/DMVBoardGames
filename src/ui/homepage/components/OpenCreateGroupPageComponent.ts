import {generateButton} from "../../../shared/components/ButtonGenerator.ts";
import {IS_LOGGED_IN_KEY} from "../../../shared/Constants.ts";
import {
  AbstractPageComponent,
} from "@bponnaluri/places-js";
import {BaseDynamicComponent} from "@bponnaluri/places-js";
import {LOGIN_STORE} from "../../auth/data/LoginStore.ts";
import {CreateGroupPageComponent} from "../../groups/CreateGroupPageComponent.ts";


const loadConfig = [{
      componentReducer:(data:any)=>{
        return {
          [IS_LOGGED_IN_KEY]: data?.loggedIn
        }
      },
      dataStore:LOGIN_STORE
    }]


const CREATE_GROUP_BUTTON_ID = "open-create-group-page-button-id"
export class OpenCreateGroupPageComponent extends BaseDynamicComponent {

  constructor() {
    super(loadConfig);
  }

  override getTemplateStyle():string{
    return `  
      <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>
      <link rel="stylesheet" type="text/css" href="/styles/styles.css"/>
      <style>
      
      #open-create-group-div {
        border-bottom:  5px solid;
        border-image-source: url(assets/Section_Border_Tiny.png);
        border-image-slice: 5 5;
        border-image-repeat: round;
      }
            
      </style>`
  }

  connectedCallback(){
    this.addEventListener("click", (event:any)=>{
      event.preventDefault();
      if(event.target.id === CREATE_GROUP_BUTTON_ID){
        AbstractPageComponent.updateRoute(CreateGroupPageComponent, event.params)
      }
      event.stopPropagation();
    });
  }


  render(data: any){
    if(!data[IS_LOGGED_IN_KEY]){
      return ''
    }
    return `
        <div id="open-create-group-div" class= "homepage-default-action-div">
        <div class = "image-div">  
          <img src="/assets/house.png">
        </div>
        ${generateButton({
          id: CREATE_GROUP_BUTTON_ID,
          text: "Create group",
        })}
        </div>
    `
  }
}

if (!customElements.get("open-create-group-component")) {
  customElements.define("open-create-group-component", OpenCreateGroupPageComponent);
}