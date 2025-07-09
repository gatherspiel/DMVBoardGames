import {BaseTemplateDynamicComponent} from "../../../../framework/components/BaseTemplateDynamicComponent.ts";
import {getUrlParameter} from "../../../../framework/utils/UrlParamUtils.ts";

const templateStyle = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>

  <style>
    #create-group-error-message {
    }
  </style>
`;

const loadConfig = {
  globalStateLoadConfig: {
    globalFieldSubscriptions: ["isLoggedIn"],
    waitForGlobalState: "isLoggedIn",
    defaultGlobalStateReducer: function (updates: Record<string, string>) {
      return {
        name: "",
        description: "",
        url: "",
        isVisible: updates["isLoggedIn"],
      };
    },
  },
};

export class CreateEventComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super("create-event-component", loadConfig);
  }

  getTemplateStyle(): string {
    return templateStyle;
  }

  render(data: any): string {

    return `
      ${data.isVisible ? `
        <h1>Create board game event</h1>
        
        <button>Save event</button>
        <a href="${window.location.origin}/groups.html?name=${encodeURIComponent(getUrlParameter("groupName"))}">
          Back to group
        </a>
      `
      
      : `<p>User does not have permission to access this page </p>`
      
      }  
    `;
  }
}

if (!customElements.get("create-event-component")) {
  customElements.define(
    "create-event-component",
    CreateEventComponent,
  );
}
