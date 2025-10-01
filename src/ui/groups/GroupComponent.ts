import {
  GROUP_DESCRIPTION_INPUT, GROUP_DESCRIPTION_TEXT,
  GROUP_NAME_INPUT,
  GROUP_URL_INPUT,
} from "./Constants.js";

import {
  ApiActionTypes,
  ApiLoadAction, DataStore,
} from "@bponnaluri/places-js";

import { BaseDynamicComponent } from "@bponnaluri/places-js";

import {
  convert24HourTimeForDisplay,
  convertLocationStringForDisplay,
} from "../../shared/data/EventDataUtils.ts";
import {
  generateButton,
  generateLinkButton
} from "../../shared/html/ButtonGenerator.ts";
import {
  ERROR_MESSAGE_KEY,
  SUCCESS_MESSAGE_KEY
} from "../../shared/Constants.ts";
import {API_ROOT} from "../../shared/Params.ts";

import {LoginStatusComponent} from "../../shared/html/LoginStatusComponent.ts";
import {convertDayOfWeekForDisplay} from "../../shared/data/DisplayNameConversion.ts";
import {generateErrorMessage, generateSuccessMessage} from "../../shared/html/StatusIndicators.ts";
import {getGameTypeTagSelectHtml, getTagSelectedState} from "../../shared/html/SelectGenerator.ts";
customElements.define("login-status-component", LoginStatusComponent);

const CANCEL_UPDATES_BUTTON_ID = "cancel-updates";
const EDIT_GROUP_BUTTON_ID = "edit-group-button";
const SAVE_UPDATES_BUTTON_ID = "save-updates";

export class GroupComponent extends BaseDynamicComponent {


  constructor() {
    super([{
      componentReducer:(groupData:any)=>{
        return {
          ...groupData,
          [SUCCESS_MESSAGE_KEY]:''
        }
      },
      dataStore:new DataStore(new ApiLoadAction(
        (requestParams: any) =>  {
          return {
            url: API_ROOT + `/groups/?name=${encodeURIComponent(requestParams.name)}`,
          };
        })),
      urlParams:["name"]
    }]);
  }

  getTemplateStyle(): string {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
        button {
          margin-top:0.5rem;
        }
 
        h1,h2 {
          color: var(--clr-dark-blue)
        }
        .raised {
          display: inline-block;
          line-height: 1;
        }  
        .event {
          padding-top: 1rem;
          padding-bottom: 0.5rem;
        }
        .event p {
          font-size: 1.5rem;
          max-width: 65ch;
          margin-top: 0.5rem;
          word-wrap: break-word;
          white-space: normal;
        }
        .event-time, .event-location {
          font-size: 1.25rem;
        } 
       .group-webpage-link {
          display: inline-block;
        }  
        .add-event-button {
          margin-top:0.5rem;
        }
        .${GROUP_DESCRIPTION_TEXT} {
          border: 10px solid;
          background-color: var(--clr-very-light-blue);
          border-image-source: url(assets/meepleThree.png);
          border-image-slice: 10 10;
          border-image-repeat: round;
          border-radius: 12px;
          font-size: 1.5rem;
          position: relative;
          padding: 0.5rem;
        }  
        
        #${GROUP_DESCRIPTION_INPUT} {
          display: block;
          height: 500px;
          width: 800px;
        }
        #${GROUP_NAME_INPUT} {
          display:block;
          width: 600px;
        }
        #${GROUP_URL_INPUT} {
          display: block;
          width: 600px;
        }  

        @media not screen and (width < 32em) {
          .${GROUP_DESCRIPTION_TEXT} {
            margin-top: 1rem;
          }
        }   
        @media screen and (width < 32em) {
          .${GROUP_DESCRIPTION_TEXT} {
            font-size:1rem;
            margin-top: 1rem;
            padding: 0.5rem;
          }
          .delete-button {
            margin-top: 0.5rem;
          }  
          .raised {
            margin-left:2rem;
            margin-right:2rem;
          }
        }    
      </style>
    `;
  }

  override attachHandlersToShadowRoot(shadowRoot:ShadowRoot) {
    const self = this;
    shadowRoot?.addEventListener("click", (event:any)=>{
      event.preventDefault();
      const targetId = event.target?.id;

      if(event.target.type === "checkbox"){
        self.updateData({
          [event.target.id]: self.componentStore?.[event.target.id] ? "" : "checked"
        })
      }

      if(targetId === EDIT_GROUP_BUTTON_ID) {
        self.updateData({
          isEditing: true,
        })
      }
      if(targetId === CANCEL_UPDATES_BUTTON_ID) {
        self.updateData({
          isEditing: false
        })
      }
      if(targetId === SAVE_UPDATES_BUTTON_ID){
        const params = {
          id: self.componentStore.id,
          name: (shadowRoot?.getElementById(GROUP_NAME_INPUT) as HTMLTextAreaElement)?.value,
          description: (shadowRoot?.getElementById(GROUP_DESCRIPTION_INPUT) as HTMLTextAreaElement)?.value,
          url: (shadowRoot?.getElementById(GROUP_URL_INPUT) as HTMLTextAreaElement)?.value,
          gameTypeTags:getTagSelectedState(shadowRoot)
        }

        ApiLoadAction.getResponseData({
          body: JSON.stringify(params),
          method: ApiActionTypes.PUT,
          url: API_ROOT + `/groups/?name=${encodeURIComponent(params.name)}`,
        }).then((data:any)=>{
          console.log(data);
          if(!data.errorMessage){
            self.updateData({
              ...params,
              isEditing: false,
              [SUCCESS_MESSAGE_KEY]: 'Group update successful'
            });
          } else {
            console.log("Error")
            self.updateData({
              ...params,
              [ERROR_MESSAGE_KEY]: data.errorMessage
            })
          }
        })
      }
    })
  }

  renderEditMode(groupData:any):string {
    return`
    
    <h1>Editing group information</h1>
    ${groupData[ERROR_MESSAGE_KEY] ? generateErrorMessage(groupData[ERROR_MESSAGE_KEY]) : ''}

    <form>
      <label>Group name</label>
      <input
        id=${GROUP_NAME_INPUT}
        value="${groupData.name}"
      />
      <label>Group description</label>
  
      <textarea
        id=${GROUP_DESCRIPTION_INPUT}
      />${groupData.description}
      </textarea>        
  
      <label>Group url</label>
      <input
        id=${GROUP_URL_INPUT}
        value=${groupData.url}
      />
  
      ${getGameTypeTagSelectHtml(groupData)}
      
      ${generateButton({
        id: SAVE_UPDATES_BUTTON_ID,
        text: "Save updates",
        type: "submit",
      })}
  
      ${generateButton({
        id: CANCEL_UPDATES_BUTTON_ID,
        text: "Cancel updates",
      })}
    </form>`
  }

  renderGroupEditUI(groupData:any):string {
    return `
      ${groupData[SUCCESS_MESSAGE_KEY] ? generateSuccessMessage(groupData[SUCCESS_MESSAGE_KEY]) : ''}
      <div class="group-title">
        ${generateButton({
          id:EDIT_GROUP_BUTTON_ID,
          text: "Edit group info",
        })}
        ${generateLinkButton({
          class: "add-event-button",
          text: "Add event",
          url: `beta/addEvent.html?name=${encodeURIComponent(groupData.name)}&groupId=${encodeURIComponent(groupData.id)}`
        })}
        ${generateLinkButton({
          class: "delete-button",
          text: "Delete group",
          url: `beta/delete.html?name=${encodeURIComponent(groupData.name)}&id=${encodeURIComponent(groupData.id)}`
        })}
      </div>`
  }

  renderWeeklyEventData(eventData:any, groupId:any, key:string){

    const dayString = convertDayOfWeekForDisplay(eventData.day);
    return `
      <div id=${key} class="event">
        ${generateLinkButton({
          text: eventData.name,
          url: `groups/event.html?id=${encodeURIComponent(eventData.id)}&groupId=${encodeURIComponent(groupId)}`
        })}
        <p class="event-time">
          ${dayString}s from ${convert24HourTimeForDisplay(eventData.startTime)} to 
          ${convert24HourTimeForDisplay(eventData.endTime)} 
        </p>
        <p class="event-location">Location: ${convertLocationStringForDisplay(eventData.location)}</p>

      </div>
      <div class="section-separator-small"></div>
    `;
  }

  renderOneTimeEventData(eventData:any, groupId:any, key:string){

    const startDate = `${eventData.startDate[0]}-${eventData.startDate[1]}-${eventData.startDate[2]}`
    return `
      <div id=${key} class="event">
        ${generateLinkButton({
          text: eventData.name,
          url: `groups/event.html?id=${encodeURIComponent(eventData.id)}&groupId=${encodeURIComponent(groupId)}`
        })}
        <p class = "event-time">${startDate} ${convert24HourTimeForDisplay(eventData.startTime)}</p>
        <p class = "event-location">Location: ${convertLocationStringForDisplay(eventData.location)}</p>

      </div>
      <div class="section-separator-small"></div>
    `;
  }

  render(groupData: any): string {
    if (!groupData.permissions) {
      return `<h1>Loading</h1>`;
    }

    const self = this;
    return `
      <div class="ui-section">
      ${!groupData.isEditing ? `
        <h1>
          ${generateLinkButton({
            class: "group-webpage-link",
            text: groupData.name,
            url:groupData.url
          })}
       </h1>
        ${groupData.permissions.userCanEdit ? this.renderGroupEditUI(groupData) : ''}
        <p class="${GROUP_DESCRIPTION_TEXT}">${groupData.description}</p> 
        ` : 
        this.renderEditMode(groupData)
      }

     ${groupData.oneTimeEventData.length === 0 && groupData.weeklyEventData.length === 0 ?
      `<p id="no-event">Click on group link above for event information</p>`:
      `<h1 class="hide-mobile">Upcoming recurring events</h1>`
    }
    ${
      groupData.weeklyEventData.length === 0
        ? ``
        : `  
          <div class="section-separator-medium"></div>
          ${groupData.weeklyEventData.map((event: any) => {
            return self.renderWeeklyEventData(event,groupData.id, groupData.id + "-event-" + event.id)
          }).join(" ")}
        `
    }
 
    ${
      groupData.oneTimeEventData.length === 0
        ? ``
        : `  
          <h1>Other events</h1> 
          <div class="section-separator-medium"></div>
          ${groupData.oneTimeEventData
            .map((event: any) => {
              return self.renderOneTimeEventData(event,groupData.id,groupData.id + "event-" + event.id)
            }).join(" ")}
          <p>Only events for the next 30 days will be visible. See the group page for information on other events.</p>
      `
      }
    </div>`;
  }
}
