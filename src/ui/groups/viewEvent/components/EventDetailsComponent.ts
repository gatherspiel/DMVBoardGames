import {BaseTemplateDynamicComponent} from "../../../../framework/components/BaseTemplateDynamicComponent.ts";
import {GET_EVENT_REQUEST_STORE, GROUP_NAME_PARAM} from "../../Constants.ts";
import {getUrlParameter} from "../../../../framework/utils/UrlParamUtils.ts";
import {EVENT_REQUEST_THUNK} from "../data/EventRequestThunk.ts";

const template = `
  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>
  <style>   
  </style>
`;


const loadConfig = {
  onLoadStoreConfig: {
    storeName: GET_EVENT_REQUEST_STORE,
    dataSource: EVENT_REQUEST_THUNK,
  },
  onLoadRequestData: {
    name: getUrlParameter(GROUP_NAME_PARAM),
  },
  thunkReducers: [
    {
      thunk: EVENT_REQUEST_THUNK,
      componentStoreReducer: function (data: any) {
        console.log(JSON.stringify(data));
        return data;
      },
    }
  ],
  globalStateLoadConfig: {
    globalFieldSubscriptions: ["isLoggedIn"],
    waitForGlobalState: "isLoggedIn",
  },
};


export class EventDetailsComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super("group-event-component", loadConfig);
  }

  connectedCallback() {
    this.updateStore({});
  }

  render(data: any): string {
    console.log(JSON.stringify(data));

    return `
      <div class="ui-section">
        <h1>View group event</h1>
        <button>Edit event</button>  
        <button>Back to group</button> 
      </div>
 
    `;
  }

  getTemplateStyle(): string {
    return template;
  }
}

if (!customElements.get("event-details-component")) {
  customElements.define("event-details-component", EventDetailsComponent);
}
