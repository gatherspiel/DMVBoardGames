import { BaseTemplateDynamicComponent } from "../../../../framework/components/BaseTemplateDynamicComponent.ts";
import type { OpenCreateGroupPageState } from "../data/types/OpenCreateGroupPageState.ts";
import { OPEN_CREATE_GROUP_PAGE_CONFIG } from "../OpenCreateGroupPageHandler.ts";
import { getSharedButtonStyles } from "../../../utils/SharedStyles.ts";

const template = `
  <style>
 
    button {
      margin-bottom: 0.5rem;
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
    return getSharedButtonStyles();
  }

  render(data: OpenCreateGroupPageState): string {
    return `
      ${data.isVisible ? `<button id ="openGroupEditPageButton" ${this.createClickEvent(OPEN_CREATE_GROUP_PAGE_CONFIG)}>Click here to create a group </button>` : ""} 
     
    `;
  }
}

if (!customElements.get("open-create-group-page-component")) {
  customElements.define(
    "open-create-group-page-component",
    OpenCreateGroupPageComponent,
  );
}
