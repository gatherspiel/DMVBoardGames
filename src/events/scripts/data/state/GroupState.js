const groupState = {};

const groupStateSubscribedComponents = [];

const IS_VISIBLE = "isVisible";

//TODO: Prevent components from being added more than once.
export function subscribeToGroupState(component) {
  groupStateSubscribedComponents.push(component);
}

export function updateSubscriberData() {
  //TODO: Add support for use cases where a component can require state from multiple sources of data.
  groupStateSubscribedComponents.forEach(function (component) {
    component.updateData(Object.values(groupState));
  });
}

export function getGroupData(groupId) {
  return groupState[groupId];
}

export function initGroups(groups) {
  updateSearchResultState(groups);
}

export function isVisible(groupId) {
  const groupData = groupState[groupId];
  return groupData && groupData[IS_VISIBLE];
}

export function getGroupList() {
  return Object.values(groupState);
}

export function updateGroupVisibilityState(groupId) {
  groupState[groupId]["frontendState"][IS_VISIBLE] = !isVisible(groupId);
}

export function updateSearchResultState(groupResults) {
  Object.keys(groupState).forEach(function (key) {
    delete groupState[key];
  });

  Object.keys(groupResults).forEach(function (groupId) {
    const group = groupResults[groupId];
    const key = group.id;
    groupState[key] = {
      events: group["events"],
      locations: group.cities || group.locations,
      link: group.link,
      title: group.title,
      isHidden: false,
    };
  });

  updateSubscriberData();
}
