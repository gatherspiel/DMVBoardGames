import {
  getComponentState,
  updateComponentState,
} from "../../../../framework/state/ComponentStateManager.js";

const IS_VISIBLE = "isVisible";
const NAME = "title";
export const GROUP_SEARCH_RESULT_STATE_NAME = "searchResultGroupState";

export function getGroupName(groupId) {
  const state = getComponentState(GROUP_SEARCH_RESULT_STATE_NAME);
  console.log(state);
  return state[groupId][NAME];
}

export function isVisible(groupId) {
  const state = getComponentState(GROUP_SEARCH_RESULT_STATE_NAME);
  return state[groupId][IS_VISIBLE];
}

export function updateGroupVisibilityState(groupId) {
  const update = function (groupState) {
    groupState[groupId][IS_VISIBLE] = !isVisible(groupId);
    return groupState;
  };
  updateComponentState(GROUP_SEARCH_RESULT_STATE_NAME, update);
}

export function updateSearchResultState(groupResults) {
  const updatedGroupState = {};

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
