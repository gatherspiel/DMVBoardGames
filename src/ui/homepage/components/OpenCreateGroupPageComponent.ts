import {generateButton} from "../../../shared/components/ButtonGenerator.ts";
import {BaseTemplateDynamicComponent} from "../../../framework/components/BaseTemplateDynamicComponent.ts";
import {CREATE_GROUP_PAGE_HANDLER_CONFIG} from "../../../shared/nav/NavEventHandlers.ts";


const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>
  `

const loadConfig = {
  globalStateLoadConfig: {
    globalFieldSubscriptions: ["isLoggedIn"],
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
    if(!data.isLoggedIn){
      return ''
    }
    return `
        ${generateButton({
          text: "Create group",
          component: this,
          eventHandlerConfig: CREATE_GROUP_PAGE_HANDLER_CONFIG,
        })}
    `
  }
}

if (!customElements.get("create-group-component")) {
  customElements.define("create-group-component", OpenCreateGroupPageComponent);
}