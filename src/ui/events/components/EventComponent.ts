import { retrieveJSONProp } from "../../../framework/components/utils/ComponentUtils.ts";
import {
  getSharedButtonStyles,
  getSharedUiSectionStyles,
} from "../../utils/SharedStyles.ts";
import { BaseTemplateDynamicComponent } from "../../../framework/components/BaseTemplateDynamicComponent.ts";
import { VIEW_EVENT_CONFIG } from "../../groups/viewGroup/components/GroupPageHandlers.ts";

const template = `
  <style>
 
    p {
      word-wrap: break-word;
      display: inline-block;
      white-space: normal;

      font-size: 1rem;
      font-weight:600;
        
      max-width: 65ch;
      margin-top: 0.5rem;
      margin-right: 5rem;
    }
    
    .event-title, .event-location {
      font-size: 1.25rem;
      font-weight: 600;
   }
    
  </style>
`;

export class EventComponent extends BaseTemplateDynamicComponent {
  constructor() {
    super("event-component");
    this.id = "";
  }

  connectedCallback() {
    this.updateStore({});
  }

  render(): string {
    this.id = this.getAttribute("key") ?? "";
    const eventData = retrieveJSONProp(this, "data");
    let eventDay = "";
    if (eventData.eventDate) {
      eventDay = eventData.eventDate;
    } else {
      eventDay = `Day: ${eventData.day.charAt(0).toUpperCase() + eventData.day.slice(1)}`;
    }

    return `
      <div id=${this.id} class="event">
      
        <div class="ui-section">
          <h3>${eventData.name}</h3>
          <p class = "event-title">${eventDay}</p>
          <p class = "event-location">Location: ${eventData.location}</p>
          </br>  
          <p> ${eventData.summary || eventData.description}</p>
          
          <button ${this.createClickEvent(VIEW_EVENT_CONFIG)}>View event details</button>
        </div>
           
      </div>
    `;
  }

  override getSharedStyle() {
    return getSharedUiSectionStyles() + getSharedButtonStyles();
  }

  getTemplateStyle(): string {
    return template;
  }
}

if (!customElements.get("event-component")) {
  customElements.define("event-component", EventComponent);
}
