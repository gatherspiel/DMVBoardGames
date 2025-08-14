import {generateButton} from "../../../shared/components/ButtonGenerator.ts";
import {BaseTemplateDynamicComponent} from "../../../framework/components/BaseTemplateDynamicComponent.ts";
import {CREATE_GROUP_PAGE_HANDLER_CONFIG} from "../../../shared/nav/NavEventHandlers.ts";
import {EVENT_HANDLER_CONFIG_KEY, IS_LOGGED_IN_KEY} from "../../../shared/Constants.ts";
import {
  GLOBAL_FIELD_SUBSCRIPTIONS_KEY,
  GLOBAL_STATE_LOAD_CONFIG_KEY
} from "../../../framework/components/types/ComponentLoadConfig.ts";


const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>
  `

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
export class OpenCreateGroupPageComponent extends BaseTemplateDynamicComponent {

  constructor() {
    super('create-group-component', loadConfig);
  }

  override getTemplateStyle(): string {
    return template;
  }



  render(data: any){
    if(!data[IS_LOGGED_IN_KEY]){
      return ''
    }
    return `
        ${generateButton({
          text: "Create group",
          component: this,
          [EVENT_HANDLER_CONFIG_KEY]: CREATE_GROUP_PAGE_HANDLER_CONFIG,
        })}
    `
  }
}

if (!customElements.get("create-group-component")) {
  customElements.define("create-group-component", OpenCreateGroupPageComponent);
}