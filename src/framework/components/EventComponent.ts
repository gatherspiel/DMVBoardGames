import { retrieveJSONProp } from "./utils/ComponentUtils.ts";
import { BaseStaticComponent } from "./BaseStaticComponent.ts";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    .event {
        border-bottom: 1px solid var(--clr-lighter-blue);
    }
    
    p {
      word-wrap: break-word;
      display: inline-block;
      white-space: normal;
    
      color: var(--clr-dark-blue);
        
      font-size: 1rem;
      font-weight:600;
        
      max-width: 65ch;
      margin-left: 3rem;
      margin-top: 0.5rem;
    }
    
    .event-title, .event-location {
      color: var(--clr-light-blue);
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    h3 {
      color: var(--clr-dark-blue);
      font-size: 1.5rem;
      margin: 0.5rem 0 0 3rem;
    }
  </style>
  <div></div>
`;
export class EventComponent extends BaseStaticComponent {
  constructor() {
    super();
    this.id = "";
  }

  generateHTML(): string {
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
          <h3>${eventData.name}</h3>
          <p class = "event-title">${eventDay}</p>
          <p class = "event-location">Location: ${eventData.location}</p>
          </br>
          <p> ${eventData.summary || eventData.description}</p>
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
