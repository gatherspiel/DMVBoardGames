import { deserializeJSONProp } from "../../../../framework/components/utils/ComponentUtils.ts";
import { BaseTemplateDynamicComponent } from "../../../../framework/components/BaseTemplateDynamicComponent.ts";
import {
  convertDateTimeForDisplay,
  convertLocationStringForDisplay
} from "../../../../framework/utils/EventDataUtils.ts";
import {VIEW_GROUP_EVENT_PAGE_HANDLER_CONFIG} from "../../../../shared/nav/NavEventHandlers.ts";
import {generateButton} from "../../../../shared/components/ButtonGenerator.ts";
import {EVENT_HANDLER_CONFIG_KEY, EVENT_HANDLER_PARAMS_KEY} from "../../../../shared/Constants.ts";

const template = `

  <link rel="stylesheet" type="text/css" href="/styles/sharedComponentStyles.css"/>
  <style>
 
    p {
      word-wrap: break-word;
      display: inline-block;
      white-space: normal;

      font-size: 1rem;
      font-weight:600;
        
      max-width: 65ch;
      margin-top: 0.5rem;
    }
    
    .event-time, .event-location {
      font-size: 1.25rem;
      font-weight: 600;
   }
   
   .event {
      border-bottom:  5px solid;
      border-image-source: url(assets/Section_Border_Tiny.png);
      border-image-slice: 5 5;
      border-image-repeat: round;
   }
    
  </style>
`;

export class GroupEventComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super();
    this.id = "";
  }

  connectedCallback() {
    this.updateWithCustomReducer({});
  }

  render(): string {
    this.id = this.getAttribute("key") ?? "";
    const eventData = deserializeJSONProp(this, "data");

    return `
      <div id=${this.id} class="event">
      
        <div class="ui-section">
          <h3>${eventData.name}</h3>
          <p class = "event-time">${convertDateTimeForDisplay(eventData.startTime)}</p>
          <p class = "event-location">Location: ${convertLocationStringForDisplay(eventData.location)}</p>
          </br>  
          
           ${generateButton({
            class: "group-webpage-link",
            text: "View event details",
            component: this,
            [EVENT_HANDLER_CONFIG_KEY]: VIEW_GROUP_EVENT_PAGE_HANDLER_CONFIG,
            [EVENT_HANDLER_PARAMS_KEY]: {id:eventData.id,groupId:eventData.groupId}
          })}

        </div>
          
      </div>
    `;
  }

  getTemplateStyle(): string {
    return template;
  }
}

if (!customElements.get("group-page-event-component")) {
  customElements.define("group-page-event-component", GroupEventComponent);
}
