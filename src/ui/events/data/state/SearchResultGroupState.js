import {
  getComponentState,
  updateComponentState,
} from "../../../../framework/state/ComponentStateManager.js";
const searchResultGroupState = {};

const IS_VISIBLE = "isVisible";
export const GROUP_STATE_NAME = "searchResultGroupState";

export function isVisible(groupId) {
  const state = getComponentState(GROUP_STATE_NAME);
  return state[groupId][IS_VISIBLE];
}

export function updateGroupVisibilityState(groupId) {
  const update = function (groupState) {
    groupState[groupId][IS_VISIBLE] = !isVisible(groupId);
    return groupState;
  };
  updateComponentState(GROUP_STATE_NAME, update);
}

export function updateSearchResultState(groupResults) {
  const updatedGroupState = {};
  Object.keys(searchResultGroupState).forEach(function (key) {
    delete searchResultGroupState[key];
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
