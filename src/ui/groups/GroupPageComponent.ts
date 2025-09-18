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
} from "../../shared/EventDataUtils.ts";
import {
  generateButton,
  generateLinkButton
} from "../../shared/components/ButtonGenerator.ts";
import {
  SUCCESS_MESSAGE_KEY
} from "../../shared/Constants.ts";
import {API_ROOT} from "../../shared/Params.ts";

import {LoginStatusComponent} from "../../shared/components/LoginStatusComponent.ts";
import {convertDayOfWeekForDisplay} from "../../shared/DisplayNameConversion.ts";
import {generateSuccessMessage} from "../../shared/components/StatusIndicators.ts";
customElements.define("login-status-component", LoginStatusComponent);

const CANCEL_UPDATES_BUTTON_ID = "cancel-updates";
const EDIT_GROUP_BUTTON_ID = "edit-group-button";
const SAVE_UPDATES_BUTTON_ID = "save-updates";

export class GroupPageComponent extends BaseDynamicComponent {
  constructor() {
    super([{
      componentReducer:(groupData:any)=>{
        console.log("Hi")
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
        .${GROUP_DESCRIPTION_TEXT} {
          background-color: #0AACFB;
          border: 10px solid pink;
          border-image-source: url(assets/meepleThree.png);
          border-image-slice: 10 10;
          border-image-repeat: round;
          border-radius: 12px;
          display: block;
          font-size: 1.5rem;
          position: relative;
          padding: 0.5rem;
        }  
        #${GROUP_NAME_INPUT} {
          width: 600px;
        }
        #${GROUP_URL_INPUT} {
          width: 600px;
        }  
        #${GROUP_DESCRIPTION_INPUT} {
          height: 500px;
          width: 800px;
        }
        button {
          margin-top:0.5rem;
        }
        .group-webpage-link {
          display: inline-block;
        }  
        h1,h2 {
          color: var(--clr-dark-blue)
        }
        .raised {
          display: inline-block;
          line-height: 1;
        }  
        .event {
          padding-bottom: 0.5rem;
        }
        .event p {
          font-size: 1rem;
          font-weight:600;     
          max-width: 65ch;
          margin-top: 0.5rem;
          word-wrap: break-word;
          white-space: normal;
        }
       .event-time, .event-location {
          font-size: 1.25rem;
          font-weight: 600;
       } 
        .add-event-button {
          margin-top:0.5rem;
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
          url: (shadowRoot?.getElementById(GROUP_URL_INPUT) as HTMLTextAreaElement)?.value
        }

        ApiLoadAction.getResponseData({
          body: JSON.stringify(params),
          method: ApiActionTypes.PUT,
          url: API_ROOT + `/groups/?name=${encodeURIComponent(params.name)}`,
        }).then(()=>{
          self.updateData({
            ...params,
            isEditing: false,
            [SUCCESS_MESSAGE_KEY]: 'Group update successful'
          });
        })
      }
    })
  }

  renderEditMode(groupData:any):string {
    return`
    
    <h1>Editing group information</h1>

    <form>
      <label>Group name</label>
      <br>
      <input
        id=${GROUP_NAME_INPUT}
        value="${groupData.name}"
      />
      <br>
      <label>Group description</label>
      <br>
  
      <textarea
        id=${GROUP_DESCRIPTION_INPUT}
      />${groupData.description}
      </textarea>        
      <br>
  
      <label>Group url</label>
      <br>
      <input
        id=${GROUP_URL_INPUT}
        value=${groupData.url}
      />
      <br>
  
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
      ${groupData[SUCCESS_MESSAGE_KEY] ? generateSuccessMessage("Group update successful") : ''}
      <div class="group-title">
        ${generateButton({
          id:EDIT_GROUP_BUTTON_ID,
          text: "Edit group info",
        })}
        ${generateLinkButton({
          class: "add-event-button",
          text: "Add event",
          url: `groups/addEvent.html?name=${encodeURIComponent(groupData.name)}&groupId=${encodeURIComponent(groupData.id)}`
        })}
        ${generateLinkButton({
          class: "delete-button",
          text: "Delete group",
          url: `groups/delete.html?name=${encodeURIComponent(groupData.name)}&id=${encodeURIComponent(groupData.id)}`
        })}
      </div>`
  }

  renderWeeklyEventData(eventData:any, groupId:any, key:string){

    const dayString = convertDayOfWeekForDisplay(eventData.day);
    return `
      <div id=${key} class="event">
        <h2>${eventData.name}</h2>
        <p class="event-time">
          ${dayString}s from ${convert24HourTimeForDisplay(eventData.startTime)} to 
          ${convert24HourTimeForDisplay(eventData.endTime)} 
        </p>
        <p class="event-location">Location: ${convertLocationStringForDisplay(eventData.location)}</p>
        ${generateLinkButton({
          text: "View event details",
          url: `groups/event.html?id=${encodeURIComponent(eventData.id)}&groupId=${encodeURIComponent(groupId)}`
        })}
      </div>
      <div class="section-separator-small"></div>
    `;
  }

  renderOneTimeEventData(eventData:any, groupId:any, key:string){

    const startDate = `${eventData.startDate[0]}-${eventData.startDate[1]}-${eventData.startDate[2]}`
    return `
      <div id=${key} class="event">
          <h2>${eventData.name}</h2>
          <p class = "event-time">${startDate} ${convert24HourTimeForDisplay(eventData.startTime)}</p>
          <p class = "event-location">Location: ${convertLocationStringForDisplay(eventData.location)}</p>
           ${generateLinkButton({
            text: "View event details",
            url: `groups/event.html?id=${encodeURIComponent(eventData.id)}&groupId=${encodeURIComponent(groupId)}`
          })}
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
      `<h1 class="hide-mobile">Upcoming events</h1>`
    }
    ${
      groupData.weeklyEventData.length === 0
        ? ``
        : `  
          <div class="section-separator-medium"></div>
          ${groupData.weeklyEventData.map((event: any) => {
            return self.renderWeeklyEventData(event,groupData.id, groupData.id + "event-" + event.id)
          }).join(" ")}
        `
    }
 
    ${
      groupData.oneTimeEventData.length === 0
        ? ``
        : `  
          <h2>Other events</h2> 
          <div class="section-separator-medium"></div>
          ${groupData.oneTimeEventData
            .map((event: any) => {
              return self.renderOneTimeEventData(event,groupData.id,groupData.id + "event-" + event.id)
            }).join(" ")}
          <p>Only events for the next 30 days will be visible. See the group page for information on other events.</p>
      `
      }
    `;
  }
}
