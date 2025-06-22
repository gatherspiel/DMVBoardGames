import { retrieveJSONProp } from "./utils/ComponentUtils.ts";
import { getSharedUiSectionStyles } from "../../ui/utils/SharedStyles.ts";
import { BaseTemplateDynamicComponent } from "./BaseTemplateDynamicComponent.ts";

const template = `<style>
 
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
    this.generateAndSaveHTML({});
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

        </div>
           
      </div>
    `;
  }

  override getSharedStyle() {
    return getSharedUiSectionStyles();
  }

  getTemplateStyle(): string {
    return template;
  }
}

if (!customElements.get("event-component")) {
  customElements.define("event-component", EventComponent);
}
