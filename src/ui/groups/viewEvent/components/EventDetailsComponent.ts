import {BaseTemplateDynamicComponent} from "../../../../framework/components/BaseTemplateDynamicComponent.ts";
import {GET_EVENT_REQUEST_STORE, GROUP_NAME_PARAM} from "../../Constants.ts";
import {getUrlParameter} from "../../../../framework/utils/UrlParamUtils.ts";
import {EVENT_REQUEST_THUNK} from "../data/EventRequestThunk.ts";
import type {EventDetailsData} from "../data/EventDetailsData.ts";
import {CANCEL_EDIT_EVENT_DETAILS_CONFIG, EDIT_EVENT_DETAILS_CONFIG} from "../EditEventDetailsHandler";
import {
  convertDateTimeForDisplay,
  convertDayOfWeekForDisplay,
  convertLocationStringForDisplay
} from "../../../../framework/utils/DateUtils.ts";

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

  render(data: EventDetailsData): string {
    return data.isEditing ? this.renderEditMode(data) : this.renderViewMode(data);
  }

  renderEditMode(data:EventDetailsData): string {
    return `<h1>Editing: ${data.name}</h1>

    <button>Save event</button>
    <button ${this.createClickEvent(CANCEL_EDIT_EVENT_DETAILS_CONFIG)}>Back to event</button>
   `
  }

  renderViewMode(data:EventDetailsData): string {

    return `
      <div class="ui-section">
        <h1>${data.name}</h1>
        
        <p>Time: ${convertDayOfWeekForDisplay(data.day)}, ${convertDateTimeForDisplay(data.startTime)}</p>
        <p>Location: ${convertLocationStringForDisplay(data.location)}</p>
        <p>${data.description}</p>
        ${data.permissions.userCanEdit ?
      `<button ${this.createClickEvent(EDIT_EVENT_DETAILS_CONFIG)}>Edit event</button>  
          ` :
      ``
    }
        <a href="/groups.html?name=${encodeURIComponent(data.groupName)}">Back to group</a> 
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
