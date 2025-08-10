export function updateSearchResultGroupStore(groupResults: any) {
  const updatedGroupStore: Record<string, any> = {};

  Object.keys(groupResults).forEach((groupId)=>{
    const group = groupResults[groupId];

    const key = `group-${group.id}`;
    updatedGroupStore[key] = {
      events: group["events"],
      locations: group.cities || group.locations,
      url: group.url,
      title: group.name,
      summary: group.summary,
      isHidden: false,
    };
  });
  return {
    groups: updatedGroupStore,
  };
}
