import { retrieveJSONProp } from "./utils/ComponentUtils.ts";
import { BaseTemplateComponent } from "./BaseTemplateComponent.ts";

const template = document.createElement("template");
template.innerHTML = `
  <style>
 
   
    .event-info {
      background: hsl(from var(--clr-lighter-blue) h s l / 0.05);
      border-radius: 10px;
      color: var(--clr-dark-blue);
      font-size: 1.25rem;
      font-weight:600;
      margin-top: 2rem;
      padding-left:1.5rem;
      padding-top: 0.5rem;
    }
     
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
  <div></div>
`;
export class EventComponent extends BaseTemplateComponent {
  constructor() {
    super();
    this.id = "";
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
      
        <div class="event-info">
          <h3>${eventData.name}</h3>
          <p class = "event-title">${eventDay}</p>
          <p class = "event-location">Location: ${eventData.location}</p>
          </br>  
          <p> ${eventData.summary || eventData.description}</p>

        </div>
           
      </div>
    `;
  }

  getTemplate(): HTMLTemplateElement {
    return template;
  }
}

if (!customElements.get("event-component")) {
  customElements.define("event-component", EventComponent);
}
