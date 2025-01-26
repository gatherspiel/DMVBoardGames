import { ListComponent } from "./shared/ListComponent.js";
import { groupState } from "../EventDisplay.js";
import { findResults } from "../data/search/search.js";
export class EventListComponent extends ListComponent {
  constructor(parentNodeName, data) {
    super(parentNodeName, data);
  }

  render(componentState) {
    console.log("Rendering");
  }

  updateGroupVisibilityState(groupId) {
    if (this.isVisible(groupId)) {
      groupState[groupId]["frontendState"].isVisible = false;
    } else {
      groupState[groupId]["frontendState"].isVisible = true;
    }
  }

  isVisible(groupId) {
    const groupData = groupState[groupId]["frontendState"];
    return groupData && groupData.isVisible;
  }

  showHideHandler(groupId) {
    this.updateGroupVisibilityState(groupId);

    const groupElement = document.querySelector("#" + groupId);
    groupElement.innerHTML = this.getItemHtml(getGroupData(groupId));
    this.addEventHandler(groupElement);
  }

  addEventHandler(groupElement) {
    const groupId = groupElement.id;
    const showHideButton = groupElement.querySelector(".show-hide-button");

    showHideButton.addEventListener("click", () =>
      this.showHideHandler(groupId),
    );
  }

  isVisible(groupId) {
    const groupData = groupState[groupId]["frontendState"];
    return groupData && groupData.isVisible;
  }

  setupEventHandlers() {
    const groups = document.querySelectorAll(".event-group");
    groups.forEach((group) => {
      this.addEventHandler(group);
    });
  }
  getItemHtml(group) {
    let groupHtml = "";
    const groupId = "group-" + group.id;
    groupHtml = `
      <div id=${groupId} class=${"event-group"}>
        <h2>
          <a href=${group.link}>${group.title}</a>
          <span>:&nbsp;${group.locations.replaceAll(",", ", ")}</span>
        </h2>  
        
        <button class='show-hide-button'>
          ${this.isVisible(groupId) ? "Hide info" : "Show info"}
        </button>
        ${
          this.isVisible(groupId)
            ? `
          <div>
          ${
            group.events.length === 0
              ? "Click on group link above for event information"
              : ""
          }
          ${group.events
            .map((event) => {
              return `<div id=${groupId + "event-" + event.id}>
                    <h4>${event.title}</h4>
                    <p>Summary: ${event.summary}</p>
                    <p>Day: ${event.day}</p>
                    <p>Location: ${event.location}</p>
                  </div>`;
            })
            .join(" ")}  
          `
            : ``
        }
      </div>
    `;
    return groupHtml;
  }

  generateHtml(groupData) {
    let html = "";

    if (groupData && Object.values(groupData).length > 0) {
      Object.values(groupData).forEach((group) => {
        groupState["group-" + group.id] = {
          groupData: group,
          frontendState: {},
        };

        let groupHtml = "";
        groupHtml = this.getItemHtml(group);
        html += groupHtml;
      });
    } else {
      html += `
      <p>No events found.</p>
    `;
    }
    return html;
  }

  //TODO: Implement logic to setup event handlers in Component.js or another framework file.
  renderWithUpdatedData(data) {
    const html = this.generateHtml(data);
    document.querySelector(`#${this.name}`).innerHTML = html;
    this.setupEventHandlers();

    document.addEventListener("search", (e) => {
      const searchParams = e.detail;
      const searchResults = findResults(data, searchParams);
      this.renderWithUpdatedData(Object.values(searchResults.groups));
    });
  }

  static createComponent(parentNodeName, data) {
    return new EventListComponent(parentNodeName, data);
  }
}
