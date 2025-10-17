import {
  GROUP_DESCRIPTION_INPUT, GROUP_DESCRIPTION,
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
import {API_ROOT, IMAGE_BUCKET_URL} from "../../shared/Params.ts";

import {LoginStatusComponent} from "../../shared/html/LoginStatusComponent.ts";
import {convertDayOfWeekForDisplay} from "../../shared/data/DisplayNameConversion.ts";
import {generateErrorMessage, generateSuccessMessage} from "../../shared/html/StatusIndicators.ts";
import {getGameTypeTagSelectHtml, getTagSelectedState} from "../../shared/html/SelectGenerator.ts";
customElements.define("login-status-component", LoginStatusComponent);

const CANCEL_UPDATES_BUTTON_ID = "cancel-updates";
const EDIT_GROUP_BUTTON_ID = "edit-group-button";
const SAVE_UPDATES_BUTTON_ID = "save-updates";

const DESCRIPTION_ERROR_TEXT_KEY = "descriptionErrorText";
const NAME_ERROR_TEXT_KEY = "nameErrorText";

export class GroupComponent extends BaseDynamicComponent {

  constructor() {
    super([{
      componentReducer:(groupData:any)=>{
        let gameTypeTags:Record<string,string>={}
        if(groupData.gameTypeTags.length > 0){
          groupData.gameTypeTags.forEach((tag:string)=>{
            gameTypeTags[tag.substring(0,1)+tag.substring(1).toLowerCase().replaceAll("_", " ")]="checked";
          })
        }
        return {
          ...groupData,
          gameTypeTags:gameTypeTags,
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
        #game-type-tag-select > :not(:first-child) {
          padding-left: 0.25rem;
        }  
        #group-name-header {
          margin-bottom:0.5rem;
          margin-left:-1.5rem;
          margin-top: 0.5rem;
        }
        #other-events-header {
          margin-top: 0.5rem;
        }
        #recurring-events-separator {
          margin-left: -1.5rem;
        }  
        .add-event-button {
          margin-top:0.5rem;
        }
        .event {
          padding-top: 1rem;
          padding-bottom: 0.5rem;
        }
        .event p {
          max-width: 65ch;
          margin-top: 0.5rem;
          word-wrap: break-word;
          white-space: normal;
        }
       .group-webpage-link {
          display: inline-block;
          margin-top: 0.5rem;
        }  
        .${GROUP_DESCRIPTION} {
          margin-bottom:0.5rem;
        }  
        @media not screen and (width < 32em) {
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
          .${GROUP_DESCRIPTION} {
            margin-top: 1rem;
          }
  
          .raised {
            display: inline-block;
            line-height: 1;
          }  
         #group-name-header {
            margin-bottom:0.5rem;
            margin-left:-1.5rem;
            margin-top: 0.5rem;
            padding-left:1.5rem;
          }
          h2 {
            margin-left:-1.5rem;
            padding-left: 1.5rem;
          }

        }   
        @media screen and (width < 32em) {
          #${GROUP_DESCRIPTION_INPUT} {
            height:10rem;
          }
          .${GROUP_DESCRIPTION} {
            font-size:1rem;
            margin-top: 1rem;
            padding: 0.5rem;
          }
          .delete-button {
            margin-top: 0.5rem;
          }  
          .label-border-left {
            border-top:1px solid;
            border-left:none;
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

      let useDefault = false;
      const targetId = event.target?.id;

      console.log(targetId)
      if(event.target.type === "checkbox"){
        event.preventDefault();
        self.updateData({
          name: (shadowRoot?.getElementById(GROUP_NAME_INPUT) as HTMLTextAreaElement)?.value,
          description: (shadowRoot?.getElementById(GROUP_DESCRIPTION_INPUT) as HTMLTextAreaElement)?.value,
          url: (shadowRoot?.getElementById(GROUP_URL_INPUT) as HTMLTextAreaElement)?.value,
          gameTypeTags: getTagSelectedState(shadowRoot)
        })
      }
      else if(targetId === EDIT_GROUP_BUTTON_ID) {
        self.updateData({
          isEditing: true,
          [DESCRIPTION_ERROR_TEXT_KEY]: '',
          [ERROR_MESSAGE_KEY]: '',
          [NAME_ERROR_TEXT_KEY]: '',
          [SUCCESS_MESSAGE_KEY]: ''
        })
      }
      else if(targetId === CANCEL_UPDATES_BUTTON_ID) {
        self.updateData({
          isEditing: false
        })
      }
      else if(targetId === SAVE_UPDATES_BUTTON_ID){
        const validationErrorState:Record<string,string> = {[SUCCESS_MESSAGE_KEY]:''}
        const groupName = (shadowRoot?.getElementById(GROUP_NAME_INPUT) as HTMLInputElement)?.value;
        if(!groupName || groupName.length === 0){
          validationErrorState[NAME_ERROR_TEXT_KEY] = "Name is a required field"
        }
        const groupDescription = (shadowRoot?.getElementById(GROUP_DESCRIPTION_INPUT) as HTMLTextAreaElement)?.value.trim();
        if(!groupDescription || groupDescription.length === 0){
          validationErrorState[DESCRIPTION_ERROR_TEXT_KEY]="Description is a required field"
        }
        const params = {
          id: self.componentStore.id,
          name: groupName,
          description: groupDescription,
          url: (shadowRoot?.getElementById(GROUP_URL_INPUT) as HTMLTextAreaElement)?.value,
          gameTypeTags:Object.keys(getTagSelectedState(shadowRoot))
        }
        if(Object.keys(validationErrorState).length >1){
          self.updateData({...validationErrorState,...params});
          return;
        }
        ApiLoadAction.getResponseData({
          body: JSON.stringify(params),
          method: ApiActionTypes.PUT,
          url: API_ROOT + `/groups/?name=${encodeURIComponent(params.name)}`,
        }).then((data:any)=>{
          if(!data.errorMessage){
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });
            self.updateData({
              ...params,
              isEditing: false,
              [SUCCESS_MESSAGE_KEY]: 'Group update successful'
            });
          } else {
            self.updateData({
              ...params,
              [ERROR_MESSAGE_KEY]: data.errorMessage
            })
          }
        })
      } else {
        useDefault = true;
      }
      if(!useDefault){
        event.preventDefault();
      }
    })
  }
  renderEditMode(groupData:any):string {
    return`
    
      <h2>Edit group information</h2>
      <div class="section-separator-small"></div>
      ${groupData[ERROR_MESSAGE_KEY] ? generateErrorMessage(groupData[ERROR_MESSAGE_KEY]) : ''}
  
      <form>
        
        <div class="form-section">
          <label class="required-field">Name</label>
          <input
            id=${GROUP_NAME_INPUT}
            value="${groupData.name}"
          />
          ${generateErrorMessage(groupData[NAME_ERROR_TEXT_KEY])}
        </div>
  
        
        <div class="form-section">
          <label class="required-field">Description</label>
          <textarea
            id=${GROUP_DESCRIPTION_INPUT}
          />${groupData.description}</textarea>    
          ${generateErrorMessage(groupData[DESCRIPTION_ERROR_TEXT_KEY])}
        </div>
  
        <div class="form-section">
          <label class="form-field-header">Url</label>
          <input
            id=${GROUP_URL_INPUT}
            value="${groupData.url}"
          />
        </div>
    
        ${getGameTypeTagSelectHtml(groupData.gameTypeTags)}
        
        ${generateButton({
          id: SAVE_UPDATES_BUTTON_ID,
          text: "Submit",
          type: "submit",
        })}
        ${generateButton({
          id: CANCEL_UPDATES_BUTTON_ID,
          text: "Cancel",
        })}
      </form>`
  }

  renderGroupEditUI(groupData:any):string {
    return `
      <span id="${EDIT_GROUP_BUTTON_ID}">Edit group information</span>
      <a href="beta/addEvent.html?name=${encodeURIComponent(groupData.name)}&groupId=${encodeURIComponent(groupData.id)}">Add event</a>
      <a href="beta/delete.html?name=${encodeURIComponent(groupData.name)}&id=${encodeURIComponent(groupData.id)}">Delete group</a>
    `
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
        <p class="event-location">${convertLocationStringForDisplay(eventData.location)}</p>
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

    let html = ``;
    if(groupData.permissions.userCanEdit) {
      html+=`
        <div id="user-actions-menu">
          <nav  id="user-actions-menu-raised" class="raised">
            <span class="shadow"></span>
              <span class="edge"></span>
              <span class="front" id="user-actions-front">
              <div class="top-nav-secondary">
                ${this.renderGroupEditUI(groupData)}
              </div>
            </span>
          </nav>
        </div>
      `
    }
    return html+`
      
      
      <div class="ui-section">
      
      <h1 id="group-name-header">${groupData.name}</h1>
      ${groupData[SUCCESS_MESSAGE_KEY] ? generateSuccessMessage(groupData[SUCCESS_MESSAGE_KEY]) : ''}
      ${!groupData.isEditing ? `
          ${groupData.url ? generateLinkButton({
            class: "group-webpage-link",
            text: "Group website",
            url:groupData.url
          }) : ''}
        <div class="${GROUP_DESCRIPTION}">
          <h2>Group description</h2>
          <span>${groupData.description}</span> 
        </div>
        ` : 
        this.renderEditMode(groupData)
      }

      <img src="${IMAGE_BUCKET_URL}${groupData.imagePath}"></img>
     ${groupData.oneTimeEventData.length === 0 && groupData.weeklyEventData.length === 0 ?
      `<p id="no-event">No events found for group</p>`:
      `
        <h2>Upcoming recurring events</h2>
      `
    }
    ${
      groupData.weeklyEventData.length === 0
        ? ``
        : `  
          ${groupData.weeklyEventData.map((event: any) => {
            return self.renderWeeklyEventData(event,groupData.id, groupData.id + "-event-" + event.id)
          }).join(" ")}
        `
    }
 
    ${
      groupData.oneTimeEventData.length === 0
        ? ``
        : `
          <h2 id="other-events-header">Other events</h2> 
          ${groupData.oneTimeEventData
            .map((event: any) => {
              return self.renderOneTimeEventData(event,groupData.id,groupData.id + "event-" + event.id)
            }).join(" ")}
          <p>Only events for the next 30 days will be visible.</p>
      `
      }
    </div>`;
  }
}
