import {
  getState,
  updateState,
} from "../../../../framework/State/StateManager.js";
const groupState = {};

const groupStateSubscribedComponents = [];

const IS_VISIBLE = "isVisible";
export const GROUP_STATE_NAME = "groupState";

export function updateSubscriberData() {
  //TODO: Add support for use cases where a component can require state from multiple sources of data.
  groupStateSubscribedComponents.forEach(function (component) {
    component.updateData(groupState);
  });
}

export function initGroups(groups) {
  updateSearchResultState(groups);
}

export function isVisible(groupId) {
  const state = getState(GROUP_STATE_NAME);
  return state[groupId][IS_VISIBLE];
}

export function updateGroupVisibilityState(groupId) {
  const update = function (groupState) {
    groupState[groupId][IS_VISIBLE] = !isVisible(groupId);
    return groupState;
  };
  updateState(GROUP_STATE_NAME, update);
}

export function updateSearchResultState(groupResults) {
  const updatedGroupState = {};
  Object.keys(groupState).forEach(function (key) {
    delete groupState[key];
  });

  Object.keys(groupResults).forEach(function (groupId) {
    const group = groupResults[groupId];

    const key = `group-${group.id}`;
    updatedGroupState[key] = {
      events: group["events"],
      locations: group.cities || group.locations,
      url: group.url,
      title: group.name,
      summary: group.summary,
      isHidden: false,
    };
  });
  return updatedGroupState;
}
