import { GROUP_STATE_NAME, isVisible } from "../../data/state/GroupState.js";
import { subscribeToState } from "../../../../framework/state/StateManager.js";
import { setupEventHandlers } from "./EventListHandlers.js";
export class EventListComponent extends HTMLElement {
  constructor() {
    super();
    subscribeToState(GROUP_STATE_NAME, this);
  }

  getItemHtml(groupId, group) {
    let groupHtml = "";
    const events = group.events || [];
    groupHtml = `
      <div id=${groupId} class=${"event-group"}>
        <button class='show-hide-button'>
          ${isVisible(groupId) ? "Hide info" : "Show info"}
        </button>
        <h2>
          <a href=${group.url}>${group.title}</a>
        </h2>  
          <p>${group.locations.join(", ")}</p>        
        ${
          isVisible(groupId)
            ? `
          <div class="event-summary"><p>${group.summary}</p></div>
          <div>
          ${
            events.length === 0
              ? `<p id="no-event">Click on group link above for event information</p>`
              : ""
          }
          ${events
            .map((event) => {
              return `<div id=${groupId + "event-" + event.id} class="event">
                    <h3>${event.name}</h3>
                    <p>Day: ${event.day.charAt(0).toUpperCase() + event.day.slice(1)}</p>
                    <p>Location: ${event.location}</p>
                    </br>
                    <p>Summary: ${event.summary}</p>
                  </div>`;
            })
            .join(" ")} 
            </div> 
          `
            : ``
        }
      </div>
    `;

    return groupHtml;
  }

  generateHtml(groupData) {
    let html = ``;

    let visibleEvents = 0;
    if (groupData && Object.values(groupData).length > 0) {
      Object.keys(groupData).forEach((groupId) => {
        const group = groupData[groupId];
        let groupHtml = "";
        groupHtml = this.getItemHtml(groupId, group);
        html += groupHtml;
        visibleEvents++;
      });
    }

    if (visibleEvents === 0) {
      html += `
      <p>No events found.</p>
    `;
    }
    return html;
  }

  updateData(data) {
    const html = this.generateHtml(data);
    this.innerHTML = html;
    setupEventHandlers();
  }
}

if (!customElements.get("event-list-component")) {
  customElements.define("event-list-component", EventListComponent);
}
