import { ListComponent } from "./shared/ListComponent.js";

import { getSearchResultGroups } from "../data/search/SearchAPI.js";
import {
  getGroupData,
  initGroups,
  updateSubscriberData,
  isVisible,
  updateGroupVisibilityState,
  updateSearchResultState,
} from "../data/state/GroupState.js";
import { SearchParams } from "../data/search/model/SearchParams.js";

//TODO: Create state management logic in framework folder to store state.

document.addEventListener("updateGroupState", (e) => {
  const groups = e.detail.data;
  initGroups(groups);
  updateSubscriberData();
});

export class EventListComponent extends ListComponent {
  constructor(parentNodeName, data) {
    super(parentNodeName, data);
  }

  render(componentState) {
    console.log("Rendering");
  }

  showHideHandler(groupId) {
    updateGroupVisibilityState(groupId);

    const groupElement = document.querySelector("#" + groupId);
    groupElement.innerHTML = this.getItemHtml(getGroupData(groupId).data);
    this.addEventHandler(groupElement);
  }

  addEventHandler(groupElement) {
    const groupId = groupElement.id;
    const showHideButton = groupElement.querySelector(".show-hide-button");

    showHideButton.addEventListener("click", () =>
      this.showHideHandler(groupId),
    );
  }

  setupEventHandlers() {
    const groups = document.querySelectorAll(".event-group");
    groups.forEach((group) => {
      this.addEventHandler(group);
    });
  }
  getItemHtml(groupId, group) {
    let groupHtml = "";

    const events = group.events;
    groupHtml = `
      <div id=${groupId} class=${"event-group"}>
        <button class='show-hide-button'>
          ${isVisible(groupId) ? "Hide info" : "Show info"}
        </button>
        <h2>
          <a href=${group.link}>${group.title}</a>
        </h2>  
          <p>${group.locations.join(", ")}</p>        
        ${
          isVisible(groupId)
            ? `
          <div>
          ${
            events.length === 0
              ? `<p id="no-event">Click on group link above for event information</p>`
              : ""
          }
          ${events
            .map((event) => {
              return `<div id=${groupId + "event-" + event.id} class="event">
                    <h3>${event.title}</h3>
                    <p>Day: ${event.day}</p>
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
    let html = "";

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

  //TODO: Implement logic to setup event handlers in Component.js or another framework file.
  updateData(data) {
    const html = this.generateHtml(data);
    document.querySelector(`#${this.name}`).innerHTML = html;
    this.setupEventHandlers();
  }

  static createComponent(parentNodeName, data) {
    const listComponent = new EventListComponent(parentNodeName, data);

    //TODO: Implement addEventListener to framework folder and add logic to detect duplicate listeners.
    document.addEventListener("search", (e) => {
      const searchParams = new SearchParams(e.detail);
      getSearchResultGroups(searchParams).then((groupResults) => {
        updateSearchResultState(groupResults);
      });
    });
    return listComponent;
  }
}
