import {
  GROUP_DESCRIPTION_INPUT, GROUP_DESCRIPTION,
  GROUP_NAME_INPUT,
  GROUP_URL_INPUT,
} from "./Constants.js";

import {
  ApiActionType,

  ApiLoadAction, DataStore,
} from "@bponnaluri/places-js";

import { BaseDynamicComponent } from "@bponnaluri/places-js";

import {API_ROOT} from "../shared/Params.ts";
import {convertDayOfWeekForDisplay} from "../../shared/DisplayNameConversion.ts";
import {getGameTypeTagSelectHtml, getTagSelectedState} from "../../shared/html/SelectGenerator.ts";

import {LoginStatusComponent} from "../shared/LoginStatusComponent.ts";
import {
  ERROR_MESSAGE_KEY,
  generateErrorMessage,
  generateSuccessMessage,
  SUCCESS_MESSAGE_KEY
} from "../../shared/html/StatusIndicators.ts";
import  {ImageUploadComponent} from "../../shared/components/ImageUploadComponent.ts";
import {generateButton, generateLinkButton} from "../../shared/html/ButtonGenerator.ts";
import {RsvpComponent} from "./RsvpComponent.ts";

customElements.define('image-upload-component',ImageUploadComponent)
customElements.define("login-status-component", LoginStatusComponent);
customElements.define('rsvp-component',RsvpComponent)

const CANCEL_UPDATES_BUTTON_ID = "cancel-updates";
const EDIT_GROUP_BUTTON_ID = "edit-group-button";
const JOIN_GROUP_BUTTON_ID = "join-group-button";
const SAVE_UPDATES_BUTTON_ID = "save-updates";

const DESCRIPTION_ERROR_TEXT_KEY = "descriptionErrorText";
const NAME_ERROR_TEXT_KEY = "nameErrorText";

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
        () =>  {
          const name = (new URLSearchParams(document.location.search)).get("name") ?? "";
          return {
            url: API_ROOT + `/groups/?name=${encodeURIComponent(name)}`,
          };
        })),
    }]);
  }

  getTemplateStyle(): string {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
        button {
          margin-top:0.5rem;
        }
        #edit-group-form {
          margin-top:0.5rem;
          margin-bottom:1rem;
        }
        #game-type-tag-select > :not(:first-child) {
          padding-left: 0.25rem;
        }
        #group-description-text {
          margin-top:0.5rem;
          margin-bottom:1rem;
        }  
        #group-name-header {
          margin-bottom:0.5rem;
          margin-top: 0.5rem;
        }
        #image-preview {
          display:block;
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
        .${GROUP_DESCRIPTION} a:hover {
          background-color: var(--clr-very-light-blue)
        }
       .group-webpage-link {
          display: inline-block;
          margin-top: 0.5rem;
        }  
        .${GROUP_DESCRIPTION} {
          margin-bottom:0.5rem;
        }  
        @media not screen and (width < 32em) {
          h2 {
            margin-left:-1.5rem;
            padding-left: 1.5rem;
          }
          #${GROUP_DESCRIPTION_INPUT} {
            display: block;
          }
          #${GROUP_NAME_INPUT} {
            display:block;
            width: 600px;
          }
          #${GROUP_URL_INPUT} {
            display: block;
            width: 600px;
          }
          #group-image {
            width:63rem;
          }
          #group-name-header {
            margin-bottom:0.5rem;
            margin-left:-1.5rem;
            margin-top: 0.5rem;
            padding-left:1.5rem;
          }
          .${GROUP_DESCRIPTION} {
            margin-top: 1rem;
          }
          .raised {
            display: inline-block;
            line-height: 1;
          }  
        }   
        @media screen and (width < 32em) {
          #${GROUP_DESCRIPTION_INPUT} {
            height:10rem;
          }
          #group-image{
            width:20rem;
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

      if(event.target.type === "checkbox"){
        self.updateData({
          description: (shadowRoot?.getElementById(GROUP_DESCRIPTION_INPUT) as HTMLTextAreaElement)?.value,
          gameTypeTags: getTagSelectedState(shadowRoot),
          imagePath:(shadowRoot.getElementById("image-upload-ui") as ImageUploadComponent).getAttribute("image-path"),
          name: (shadowRoot?.getElementById(GROUP_NAME_INPUT) as HTMLTextAreaElement)?.value,
          url: (shadowRoot?.getElementById(GROUP_URL_INPUT) as HTMLTextAreaElement)?.value,
        })
      }
      else if(targetId === JOIN_GROUP_BUTTON_ID){

        const userIsMember:boolean = self.componentStore.permissions?.userIsMember
        const apiMethod =
          userIsMember ? ApiActionType.DELETE : ApiActionType.POST;

        ApiLoadAction.getResponseData({
          method: apiMethod,
          url: API_ROOT + `/user/memberData/group/${(self.componentStore.id)}`,
        }).then((response:any)=>{
          const error = response[ERROR_MESSAGE_KEY];
          if(!error){
            let permissions = Object.assign({},self.componentStore.permissions);
            permissions.userIsMember = !userIsMember
            self.updateData({
              [ERROR_MESSAGE_KEY]:'',
              [SUCCESS_MESSAGE_KEY]:'',
              permissions: permissions
            })
          } else {
            self.updateData({
              [ERROR_MESSAGE_KEY]: error,
              [SUCCESS_MESSAGE_KEY]:''
            })
          }
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
        const groupDescription = (shadowRoot?.getElementById(GROUP_DESCRIPTION_INPUT) as HTMLTextAreaElement)?.value;
        if(!groupDescription || groupDescription.length === 0){
          validationErrorState[DESCRIPTION_ERROR_TEXT_KEY]="Description is a required field"
        }

        const imageForm = shadowRoot.getElementById("image-upload-ui") as ImageUploadComponent;
        const params = {
          description: groupDescription,
          gameTypeTags:Object.keys(getTagSelectedState(shadowRoot)),
          image:imageForm.getImage(),
          imageFilePath:imageForm.getImageFilePath(),
          id: self.componentStore.id,
          name: groupName,
          url: (shadowRoot?.getElementById(GROUP_URL_INPUT) as HTMLTextAreaElement)?.value,

        }
        if(Object.keys(validationErrorState).length >1){
          self.updateData({...validationErrorState,...params});
          return;
        }
        ApiLoadAction.getResponseData({
          body: JSON.stringify(params),
          method: ApiActionType.PUT,
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
              imagePath: params.image || params.imageFilePath,
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

  render(groupData: any): string {

    if (!groupData.permissions) {
      return `<h1>Loading</h1>`;
    }
    const self = this;
    let html = ``;

    if(groupData.permissions.userCanUpdateGroupMembership){
      html =`
        <div id="user-actions-menu">
          <nav  id="user-actions-menu-raised" class="raised">
            <span class="shadow"></span>
              <span class="edge"></span>
              <span class="front" id="user-actions-front">
              <div class="top-nav-secondary">
                ${this.renderUserUi(groupData)}
              </div>
            </span>
          </nav>
        </div>
      `
    }

    return html + `
  
      <div class="ui-section">
      <h1 id="group-name-header">${groupData.name}</h1>
      ${generateErrorMessage(groupData[ERROR_MESSAGE_KEY])}
      ${generateSuccessMessage(groupData[SUCCESS_MESSAGE_KEY])}
      ${!groupData.isEditing ? `
          ${groupData.url ? generateLinkButton({
        class: "group-webpage-link",
        text: "Group website",
        url:groupData.url
      }) : ''}
        ${groupData.imagePath ? `<img id="group-image" src="${groupData.imagePath}"/>` : ``}
        <div class="${GROUP_DESCRIPTION}">
          <h2>Group description</h2>
          <div id="group-description-text">
            <span>${groupData.description}</span> 
          </div>
        </div>
        ` :
      this.renderEditMode(groupData)
    }
    ${groupData.oneTimeEventData.length === 0 && groupData.weeklyEventData.length === 0 ?
      ``:
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

  renderEditMode(groupData:any):string {

    return`
      <h2>Edit group information</h2>
  
      <form id="edit-group-form">
        <div class="form-section">
          <label class=" required-field">Name</label>
          <input
            id=${GROUP_NAME_INPUT}
            value="${groupData.name}"
          />
          ${generateErrorMessage(groupData[NAME_ERROR_TEXT_KEY])}
        </div>
        <div class="form-section">
          <label class=" required-field">Description</label>
          <textarea
            id=${GROUP_DESCRIPTION_INPUT}
          />${groupData.description}</textarea>    
          ${generateErrorMessage(groupData[DESCRIPTION_ERROR_TEXT_KEY])}
        </div>
  
        <label class="">Image(optional)</label>
       
        <div class ="form-section" id="image-upload">
          <image-upload-component
            id="image-upload-ui"
            image-path="${groupData.imagePath}"
          ></image-upload-component>
        </div>    
        <div class="form-section">
          <label class="">Url</label>
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

  renderUserUi(groupData:any):string {

    let joinGroupText = "Join group"
    if(groupData.permissions?.userIsMember){
      joinGroupText = "Leave group";
    }


    return `
      ${groupData.permissions.userCanEdit ? `
        <span id="${EDIT_GROUP_BUTTON_ID}">Edit group information</span>
        <a href="/html/groups/addEvent.html?name=${encodeURIComponent(groupData.name)}&groupId=${encodeURIComponent(groupData.id)}">Add event</a>
        <a href="/html/groups/delete.html?name=${encodeURIComponent(groupData.name)}&id=${encodeURIComponent(groupData.id)}">Delete group</a>
      ` : ``}
      <span id="${JOIN_GROUP_BUTTON_ID}">${joinGroupText}</span>

    `
  }

  renderWeeklyEventData(eventData:any, groupId:any, key:string){
    const dayString = convertDayOfWeekForDisplay(eventData.day);

    return `
      <div id=${key} class="event">
        ${generateLinkButton({
          text: eventData.name,
          url: `/html/groups/event.html?id=${encodeURIComponent(eventData.id)}&groupId=${encodeURIComponent(groupId)}`
        })}
        <rsvp-component
          current-user-rsvp=${eventData.userHasRsvp}
          event-id=${eventData.id}
          rsvp-count=${eventData.rsvpCount}
          user-can-update-rsvp=${eventData.permissions.userCanRsvp}
        ></rsvp-component>
        <p class="event-time">
          ${dayString}s from ${(eventData.startTime)} to 
          ${(eventData.endTime)} 
        </p>
        <p class="event-location">${eventData.location}</p>
      </div>
      <div class="section-separator-small"></div>

    `;
  }

  renderOneTimeEventData(eventData:any, groupId:any, key:string){
    return `
      <div id=${key} class="event">
        ${generateLinkButton({
          text: eventData.name,
          url: `/html/groups/event.html?id=${encodeURIComponent(eventData.id)}&groupId=${encodeURIComponent(groupId)}`
        })}
        <p class = "event-time">${eventData.startDate} ${(eventData.startTime)}</p>
        <p class = "event-location">Location: ${eventData.location}</p>
      </div>
      <div class="section-separator-small"></div>
    `;
  }

}
