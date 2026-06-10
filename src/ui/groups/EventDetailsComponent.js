import {
  ApiActionType,
  ApiLoadAction,
  BaseDynamicComponent,
} from "@bponnaluri/places-js";

import {
  DAY_OF_WEEK_INPUT,
  getDayOfWeekSelectHtml,
} from "../../shared/html/SelectGenerator.js";

import {
  END_TIME_INPUT,
  EVENT_DESCRIPTION_INPUT,
  EVENT_LOCATION_INPUT,
  EVENT_NAME_INPUT,
  EVENT_ORGANIZER_INPUT,
  EVENT_URL_INPUT,
  START_DATE_INPUT,
  START_TIME_INPUT,
} from "./Constants.js";

import {
  SUCCESS_MESSAGE_KEY,
  generateErrorMessage,
  generateSuccessMessage,
} from "../../shared/html/StatusIndicators.js";

import { getEventDetailsFromForm, validate } from "./EventDetailsHandler.js";

import { API_ROOT } from "../shared/Params.js";
import { GROUP_EVENT_REQUEST_STORE } from "../../data/groups/GroupEventRequestStore.js";
import { ImageUploadComponent } from "../../shared/components/ImageUploadComponent.js";
import { LOADING_INDICATOR_CONFIG } from "../../shared/LoadingIndicatorConfig.js";
import { LoginStatusComponent } from "../shared/LoginStatusComponent.js";
import { RsvpComponent } from "./RsvpComponent.js";

import { convertTimeTo24Hours } from "../../shared/EventDataUtils.js";

customElements.define("image-upload-component", ImageUploadComponent);
customElements.define("login-status-component", LoginStatusComponent);
customElements.define("rsvp-component", RsvpComponent);

const CONFIRM_DELETE_BUTTON_ID = "confirm-delete-button";
const CANCEL_DELETE_BUTTON_ID = "cancel-delete-button";
const CANCEL_EDIT_BUTTON_ID = "cancel-edit-button";
const DELETE_EVENT_BUTTON_ID = "delete-event-button";
const EDIT_EVENT_BUTTON_ID = "edit-event-button";
const SAVE_EVENT_BUTTON_ID = "save-event-button";

export class EventDetailsComponent extends BaseDynamicComponent {
  constructor() {
    super(
      [
        {
          dataStore: GROUP_EVENT_REQUEST_STORE,
          componentReducer: (data) => {
            document.title = data.name;
            if (data.startDate && Array.isArray(data.startDate)) {
              data.startDate = data.startDate.join("-");
            }
            data.hostText = data.moderators.length > 1 ? "Hosts:" : "Host:";
            return data;
          },
        },
      ],
      LOADING_INDICATOR_CONFIG,
    );
  }

  getTemplateStyle() {
    return `
      <link rel="stylesheet" type="text/css" href="/styles/kelp.css"/>
      <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style> 
        h1 {
          margin-top:0rem;
        }   
        #delete-event-form {
          margin-top:1rem;
          margin-bottom:1em; 
        }
        #event-description {
          margin-bottom:0.5em;
        }
        #event-description b, #event-description h1, #event-description h2,#event-description h3,#event-description h4,#event-description li, #event-description p {
          color: var(--clr-darker-blue);
          text-align: left;
        } 
        #event-details-header {
          margin-top:0.5rem;
        } 
        .back-to-group-button {
          margin-top: 0.5rem;
        }
        .event-info {
          display:block;
        }
        .event-website-link {
          margin-bottom: 0.5rem;
          margin-top: 1rem;
        }
        .user-data-div-inner {
          display:flex;
        }
        .user-image-icon {
          clip-path: circle();
          height:2rem;
        }
        .user-image-div {
          display: inline-block;
        }
        .username-div {
          display: inline-block;
          margin-top: 0.5rem;
          margin-right:0.5rem
        }
        @media not screen and (width < 32em) {
          input, select, textarea {
            display: block;
          }
          #${EVENT_NAME_INPUT} {
            width: 50rem;
          }
          #${EVENT_LOCATION_INPUT} {
            width: 50rem;
          } 
          #event-image {
            margin-top: 0.5rem;
            width:63rem;
          }
          #${SAVE_EVENT_BUTTON_ID} {
            margin-bottom:0.5em;
          }
          #user-actions-menu {
            margin-bottom: 0.5rem;
          }
        } 
        @media screen and (width < 32em) {
          #${EVENT_DESCRIPTION_INPUT}{
            height: 10rem;
          }
          #event-details-form {
            margin-right:1.5rem;
          }
          #event-image {
            margin-top: 0.5rem;
            width:20rem;
          }
          #user-actions-menu-raised {
            display:inherit;
            margin-bottom: 0.5rem;
          } 
          .user-data-div {
            display: flex;
            flex-direction: column;
          }  
        }
        #print-container {
          position:relative;
        }
        #event-title {
          color: hsl(199, 100%, 33%);
          font-size:54px;
          margin-left:50px;
          margin-right:5px;
        }
        #event-time {
          color: hsl(199, 100%, 20%);
          font-size:48px;
          margin-top: -1em;
        }
        #event-details {
          font-size:48px;
          margin-left: 60px;
          margin-right: 60px;
        }
        #print-container #event-title,#event-time,#event-details {
          text-align:center;
        }
        #print-container #event-image-container {
          width:100%;
        }
        #event-image-container img {
          width:100%;
        }
        #event-image-container-outer {
          display:inline;
        }
        #print-container #event-image-container {
            max-width:1016px;
        } 
        #print-container {
            width:100%;
            height:100%;
          }
        #event-image-container-outer {
          bottom:100px; 
          height:400px;
          margin-left:60px;
          margin-right:60px;
          display:flex;
          width:auto;
        }
        
        @media not print {
          #print-container {
            background-color:white;
          }
           #event-image-container-outer {
            height:400px; 
          }
        }
         
        @page {
			    size: 8.5in 11in;
			    margin-top:0;
		    }

      </style>     
    `;
  }

  attachHandlersToShadowRoot(shadowRoot) {
    const self = this;
    shadowRoot.addEventListener("click", (event) => {
      if (event.target.id === CANCEL_EDIT_BUTTON_ID) {
        self.updateData({ isEditing: false, [SUCCESS_MESSAGE_KEY]: "" });
      }
      if (event.target.id === DELETE_EVENT_BUTTON_ID) {
        self.updateData({
          isDeleting: true,
          [SUCCESS_MESSAGE_KEY]: "",
        });
      }
      if (event.target.id === CANCEL_DELETE_BUTTON_ID) {
        self.updateData({
          errorMessage: "",
          isDeleting: false,
          [SUCCESS_MESSAGE_KEY]: "",
        });
      }
      if (event.target.id === CONFIRM_DELETE_BUTTON_ID) {
        const params = {
          id: self.componentStore.id,
          groupId: self.componentStore.groupId,
        };
        ApiLoadAction.getResponseData({
          method: ApiActionType.DELETE,
          url: `${API_ROOT}/groups/${params.groupId}/events/${encodeURIComponent(params.id)}/`,
        }).then((response) => {
          if (response.errorMessage) {
            self.updateData({
              errorMessage: response.errorMessage,
              [SUCCESS_MESSAGE_KEY]: "",
            });
          } else {
            self.updateData({
              isEditing: false,
              errorMessage: "",
              [SUCCESS_MESSAGE_KEY]: "Successfully deleted event",
            });
          }
        });
      }
      if (event.target.id === EDIT_EVENT_BUTTON_ID) {
        self.updateData({
          isEditing: true,
          [SUCCESS_MESSAGE_KEY]: "",
        });
      }
      if (event.target.id === SAVE_EVENT_BUTTON_ID) {
        const data = shadowRoot.getElementById("event-details-form")?.elements;
        const imageForm = shadowRoot.getElementById("image-upload-ui");
        const formData = {
          id: self.componentStore.id,
          [EVENT_NAME_INPUT]: data.namedItem(EVENT_NAME_INPUT).value,
          [EVENT_DESCRIPTION_INPUT]: data.namedItem(EVENT_DESCRIPTION_INPUT)
            ?.value,
          [EVENT_URL_INPUT]: data.namedItem(EVENT_URL_INPUT)?.value,
          [START_TIME_INPUT]: convertTimeTo24Hours(
            data.namedItem(START_TIME_INPUT)?.value,
          ),
          [END_TIME_INPUT]: convertTimeTo24Hours(
            data.namedItem(END_TIME_INPUT)?.value,
          ),
          [EVENT_LOCATION_INPUT]: data.namedItem(EVENT_LOCATION_INPUT)?.value,
          image: imageForm.getImage(),
          imageFilePath: imageForm.getImageFilePath(),
          isRecurring: self.componentStore.isRecurring,
        };
        if (self.componentStore.isRecurring) {
          formData[DAY_OF_WEEK_INPUT] =
            data.namedItem(DAY_OF_WEEK_INPUT)?.value;
        } else {
          formData[START_DATE_INPUT] = data.namedItem(START_DATE_INPUT)?.value;
        }

        const validationErrors = validate(formData);
        if (Object.keys(validationErrors.formValidationErrors).length !== 0) {
          self.updateData({ ...validationErrors, ...formData });
        } else {
          const eventDetails = getEventDetailsFromForm(formData);
          const moderatorEmail = data.namedItem(EVENT_ORGANIZER_INPUT)?.value;
          if (moderatorEmail) {
            eventDetails["moderators"] = [
              {
                email: moderatorEmail,
              },
            ];
          }

          const groupId = new URLSearchParams(document.location.search).get(
            "groupId",
          );

          ApiLoadAction.getResponseData({
            body: JSON.stringify(eventDetails),
            method: ApiActionType.PUT,
            url:
              API_ROOT +
              `/groups/${groupId}/events/?id=${encodeURIComponent(eventDetails.id)}`,
          }).then((response) => {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
            if (!response.errorMessage) {
              self.updateData({
                ...formData,
                errorMessage: "",
                imagePath: imageForm.getImage() || imageForm.getImageFilePath(),
                isEditing: false,
                [SUCCESS_MESSAGE_KEY]: "Successfully updated event",
              });
            } else {
              self.updateData({
                errorMessage: response.errorMessage,
                [SUCCESS_MESSAGE_KEY]: "",
              });
            }
          });
        }
      }
    });
  }

  render(data) {
    if(window.location.href.includes("print=true")){
      return this.generateFlier(data);
    }
    if (!data || !data.name) {
      return `<h1>Loading</h1>`;
    }
    let html = `
      <div class="container-xl fade-in-animation">
        <div id = "user-actions-menu">
          <nav id="user-actions-menu-raised"
               style="${!data.isEditing && !data.isDeleting && data?.permissions?.userCanEdit ? `` : `display:none`}">
            <button class="secondary" id="${EDIT_EVENT_BUTTON_ID}">Edit event</button>
            <button class="secondary" id="${DELETE_EVENT_BUTTON_ID}">Delete event</button>
            <a class="btn secondary" href="${window.location.href}&print=true">Printable flier</a>
          </nav>
        </div> 
        <div id="form-status-success">
          ${generateSuccessMessage(data[SUCCESS_MESSAGE_KEY])}
        </div>
    `;
    if (data.isEditing) {
      html += this.renderEditMode(data);
    } else if (data.isDeleting) {
      html += this.renderDeleteMode(data);
    } else {
      html += this.renderViewMode(data);
    }
    const url = `${window.location.origin}/html/groups/groups.html?name=${encodeURIComponent(data.groupName)}`
    
    html += `
        <div class="container-xl">
          <a class="btn secondary" href=${url}>Back to group</a>
        </div>
      </div>
    `;
    return html;
  }

  generateFlier(data){
    const imagePath = data.imageFilePath && data.imageFilePath.length > 0 ?
      data.imageFilePath 
      : `https://gatherspiel.nyc3.cdn.digitaloceanspaces.com/groups/events/20406/imageb192bdf2-f00c-4af2-8d04-cbd90b7c3f4a.jpg`
      

    return `
      <div class="container-xl" id="print-container">
        <h1 id="event-title">${data.name.toUpperCase()}</h1>
        <h1 id="event-time">
          ${data.isRecurring
              ? `${data.day}s at ${data.startTime}`
              : ``
            }
        </h1>
        <div id="event-details">
          ${data.description}
        </div>
        <div id="event-image-container-outer"> 
        <div id="event-image-container">
          <img src="${imagePath}"></img>
        </div>
        </div>
      </div>
    `
  }
  renderDeleteMode(data) {
    return `
      <div class="ui-section" style="${!data[SUCCESS_MESSAGE_KEY] ? `` : `display:none`}" >
        <h1>Are you sure you want to delete event ${data.name} ${data.isRecurring ? "" : `on ${data.startTime}`}</h1>
        <div id="delete-event-form">
          <button id=${CONFIRM_DELETE_BUTTON_ID}>Confirm delete</button>       
          <button id=${CANCEL_DELETE_BUTTON_ID}>Cancel</button>       
        </div>
      </div>
    `;
  }

  renderEditMode(data) {
    return `
      <div class="ui-section">
      <h1>Editing Event: ${data.name}</h1>
      <form id="event-details-form" onsubmit="return false">
        <div id="form-status-div">
          ${generateErrorMessage(data.errorMessage)}
        </div>
        <div class="form-section">
          <label class=" required-field">Event name</label>
          <input
            id=${EVENT_NAME_INPUT}
            name=${EVENT_NAME_INPUT}
            value="${data.name}"
          />
          </input>
        </div>
        <div class="form-section">
          <label class=" required-field"> Event description</label>
          <textarea
          id=${EVENT_DESCRIPTION_INPUT}
          name=${EVENT_DESCRIPTION_INPUT}
          />${data.description ?? ""}</textarea>       
        </div>
        <div class="form-section">
          <label class="">Event URL(optional)</label>
          <input
            name=${EVENT_URL_INPUT}
            type="url"
            value="${data.url ?? ""}"
          />
          </input>
        </div>
        <div class ="form-section" id="image-upload">
          <image-upload-component
            id="image-upload-ui"
            image-path="${data.imageFilePath}"
          ></image-upload-component>
        </div>  
   
        <div class="form-section" style="${data.isRecurring ? `` : `display:none`}">
          <label class=" required-field">Day of week</label>
          ${getDayOfWeekSelectHtml(data.day)}
        </div>
 
        <div class="form-section" style="${!data.isRecurring ? `` : `display:none`}">
          <label class=" required-field">Start date</label>
          <input
            name=${START_DATE_INPUT}
            type="date"
            value=${data.startDate}
          />
        </div> 
        <div class="form-section">
          <label class=" required-field">Start time</label>
          <input
            name=${START_TIME_INPUT}
            type="time"
            value="${convertTimeTo24Hours(data.startTime)}"
          />
          </input>
        </div>
        <div class="form-section">
          <label class=" required-field">End time</label>
          <input
            name=${END_TIME_INPUT}
            type="time"
            value=${convertTimeTo24Hours(data.endTime)}
          />
          </input>
        </div>
        <div class="form-section">
          <label class=" required-field">Event location</label>
          <input
            id=${EVENT_LOCATION_INPUT}
            name=${EVENT_LOCATION_INPUT}
            value="${data.location ?? ""}"
          />
          </input>
        </div> 
        <div class = "form-section">
          <label class="">
              Event organizer email(optional). Use if you want to make a site user an event organizer. They will
              have permissions to edit the event. If this field is left blank, existing moderator settings will be used.</label>
          <input
            id=${EVENT_ORGANIZER_INPUT}
            name=${EVENT_ORGANIZER_INPUT}
            type="email"
            value="${data.eventOrganizer ?? ""}"
          />
          </input>  
        </div> 
        <button class="primary" id=${SAVE_EVENT_BUTTON_ID}>Save event</button>   
      </form>
    </div>
   `;
  }

  displayModerators(data) {
    if (!data.moderators || data.moderators.length === 0) {
      return ``;
    }

    let moderatorHasUsername = false;
    for (let i = 0; i < data.moderators.length; i++) {
      if (data.moderators[i]?.userData?.username.length > 0) {
        moderatorHasUsername = true;
        break;
      }
    }
    if (!moderatorHasUsername) {
      return ``;
    }

    let html = ``;
    data.moderators.forEach((moderator) => {
      html += `
        <div class ="user-data-div">
          <div class="user-data-div-inner"> 
            <div class="user-image-div">
              ${moderator.userData.imageFilePath ? `<img class="user-image-icon" src="${moderator.userData.imageFilePath}"></img>` : ``}
            </div>
            <div class="username-div">
              <span><b>${data.hostText}</b> ${moderator.userData.username}</span>
            </div>
          </div>
        </div>
      `;
    });
    return html;
  }
  
  renderViewMode(data) {
    if (data.errorMessage) {
      return `${generateErrorMessage(data.errorMessage)}`;
    }
    return `
        <h1>${data.name}</h1>
        ${
          data.url &&
          !data.url.startsWith("https://dmvobardgames.com/groups/event.html")
            ? `<a class="btn secondary event-website-link" href=${data.url}>Event website</a>`
            : ""
        } 

        ${data.imageFilePath ? `<img id="event-image" src="${data.imageFilePath}"/>` : ``}

        ${this.displayModerators(data)}
        <span class="event-info"><b>Location:</b> ${data.location}</span>
        <span class="event-info">
          <b>Time:</b>${
            data.isRecurring
              ? `
              ${data.day}s from ${data.startTime} to 
              ${data.endTime}`
              : `
              ${data.startDate}, ${data.startTime}
           `
          }
        </span>  
        <rsvp-component
          current-user-rsvp="${data.userHasRsvp}"
          event-id=${data.id}
          rsvp-count=${data.rsvpCount}
          user-can-update-rsvp="${data?.permissions?.userCanRsvp}"
        ></rsvp-component>
        <div id="event-description">${data.description}</div>
      </div>
    `;
  }
}
