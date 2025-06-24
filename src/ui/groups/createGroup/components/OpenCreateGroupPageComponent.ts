import { BaseTemplateDynamicComponent } from "../../../../framework/components/BaseTemplateDynamicComponent.ts";
import type { OpenCreateGroupPageState } from "../data/types/OpenCreateGroupPageState.ts";
import {getSharedButtonAndLinkStyles} from "../../../utils/SharedStyles.ts";

const template = `
  <style>
 
    button {
      margin-bottom: 1rem;
    }
    
    #open-create-group-page-button-container {
      padding-bottom: 1rem;
    }
  </style>
  <div></div>
`;

const loadConfig = {
  globalStateLoadConfig: {
    globalFieldSubscriptions: ["isLoggedIn"],
    waitForGlobalState: "isLoggedIn",
    defaultGlobalStateReducer: function (updates: Record<string, string>) {
      return {
        isVisible: updates["isLoggedIn"],
      };
    },
  },
};

export class OpenCreateGroupPageComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super("Open_Create_Group_Page_Component_Store", loadConfig);
  }

  getTemplateStyle(): string {
    return template;
  }

  override getSharedStyle(): string {
    return getSharedButtonAndLinkStyles();
  }

  render(data: OpenCreateGroupPageState): string {
    return `
       <div id="open-create-group-page-button-container">
             ${data.isVisible ? `<a href="groups/create.html">Click to create group</a>` : ""} 

       </div>
     
    `;
  }
}

if (!customElements.get("open-create-group-page-component")) {
  customElements.define(
    "open-create-group-page-component",
    OpenCreateGroupPageComponent,
  );
}
