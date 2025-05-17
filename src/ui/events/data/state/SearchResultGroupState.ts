import { getComponentState } from "../../../../framework/state/ComponentStateManager.ts";

const NAME = "title";
export const GROUP_SEARCH_RESULT_STATE_NAME = "searchResultGroupState";

export function getGroupName(groupId: string) {
  const state = getComponentState(GROUP_SEARCH_RESULT_STATE_NAME);
  return state[groupId][NAME];
}

export function updateSearchResultState(groupResults: any) {
  const updatedGroupState: Record<string, any> = {};

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
  return {
    groups: updatedGroupState,
  };
}
