import { ListComponent } from "./shared/ListComponent.js";

import { getSearchResultGroups } from "../data/search/search.js";

//TODO: Create state management logic in framework folder to store state.
export const groupState = {};

const groupStateSubscribedComponents = [];

function getGroupData(groupId) {
  return groupState[groupId];
}

function getVisibleEvents(groupId) {
  return (
    groupState[groupId]["frontendState"]["visibleEvents"] ??
    groupState[groupId]["data"]["events"]
  );
}

//TODO: Prevent components from being added more than once.
export function subscribeToGroupState(component) {
  groupStateSubscribedComponents.push(component);
}

document.addEventListener("updateGroupState", (e) => {
  const groups = e.detail.data;

  groups.forEach(function (group) {
    groupState["group-" + group.id] = {
      data: group,
      frontendState: {
        isVisible: false,
      },
    };
  });

  //TODO: Add support for use cases where a component can require state from multiple sources of data.
  groupStateSubscribedComponents.forEach(function (component) {
    component.updateData(groupState);
  });
});

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
    groupElement.innerHTML = this.getItemHtml(getGroupData(groupId).data);
    this.addEventHandler(groupElement);
  }

  addEventHandler(groupElement) {
    const groupId = groupElement.id;
    const showHideButton = groupElement.querySelector(".show-hide-button");

    showHideButton.addEventListener("click", () =>
      this.showHideHandler(groupId)
    );
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
    const events = getVisibleEvents(groupId);
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
            events.length === 0
              ? "Click on group link above for event information"
              : ""
          }
          ${events
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
        let groupHtml = "";
        groupHtml = this.getItemHtml(group.data);
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
  updateData(data) {
    const html = this.generateHtml(data);
    document.querySelector(`#${this.name}`).innerHTML = html;
    this.setupEventHandlers();
  }

  static createComponent(parentNodeName, data) {
    const listComponent = new EventListComponent(parentNodeName, data);

    //TODO: Implement addEventListener to framework folder and add logic to detect duplicate listeners.
    document.addEventListener("search", (e) => {
      const searchParams = e.detail;
      const groupResults = getSearchResultGroups(
        Object.values(groupState),
        searchParams
      );

      //TODO: Make sure frontend state is updated with visible groups and then render component.
      groupResults.forEach(function (group) {
        groupState["group-" + group.data.id]["frontendState"]["visibleEvents"] =
          group["frontendState"]["visibleEvents"];
      });

      listComponent.updateData(Object.values(groupResults));
    });
    return listComponent;
  }
}
