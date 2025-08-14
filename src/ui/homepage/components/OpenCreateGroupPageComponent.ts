import {generateButton} from "../../../shared/components/ButtonGenerator.ts";
import {CREATE_GROUP_PAGE_HANDLER_CONFIG} from "../../../shared/nav/NavEventHandlers.ts";
import {EVENT_HANDLER_CONFIG_KEY, IS_LOGGED_IN_KEY} from "../../../shared/Constants.ts";
import {
  GLOBAL_FIELD_SUBSCRIPTIONS_KEY,
  GLOBAL_STATE_LOAD_CONFIG_KEY
} from "../../../framework/components/types/ComponentLoadConfig.ts";
import {BaseDynamicComponent} from "../../../framework/components/BaseDynamicComponent.ts";


const loadConfig = {
  [GLOBAL_STATE_LOAD_CONFIG_KEY]: {
    [GLOBAL_FIELD_SUBSCRIPTIONS_KEY]: [IS_LOGGED_IN_KEY],
    defaultGlobalStateReducer:(data:any)=>{
      return {
        [IS_LOGGED_IN_KEY]: data.isLoggedIn.isLoggedIn
      }
    }
  },
}
export class OpenCreateGroupPageComponent extends BaseDynamicComponent {

  constructor() {
    super('create-group-component', loadConfig);
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
          text: "Create group",
          component: this,
          [EVENT_HANDLER_CONFIG_KEY]: CREATE_GROUP_PAGE_HANDLER_CONFIG,
        })}
        </div>
    `
  }
}

if (!customElements.get("open-create-group-component")) {
  customElements.define("open-create-group-component", OpenCreateGroupPageComponent);
}