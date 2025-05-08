import { retrieveJSONProp } from "./utils/ComponentUtils.js";

const template = document.createElement("template");
template.innerHTML = `
    <style>
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
export class EventComponent extends HTMLElement {
  constructor() {
    super();
    this.id = "";
  }

  connectedCallback() {
    this.id = this.getAttribute("key");

    console.log(this.id);
    const eventData = retrieveJSONProp(this, "data");

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const div = this.shadowRoot.querySelector("div");

    div.innerHTML = `
 
    <div id=${this.id} class="event">
        <h3>${eventData.name}</h3>
        <p class = "event-title">Day: ${eventData.day.charAt(0).toUpperCase() + eventData.day.slice(1)}</p>
        <p class = "event-location">Location: ${eventData.location}</p>
        </br>
        <p> ${eventData.summary}</p>
    </div>
    `;
  }
}

if (!customElements.get("event-component")) {
  customElements.define("event-component", EventComponent);
}
