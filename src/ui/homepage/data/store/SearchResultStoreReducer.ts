export function updateSearchResultGroupStore(groupResults: any) {

  var results:any = groupResults.searchResults.groupData;
  const updatedGroupStore: Record<string, any> = {};

  Object.keys(results).forEach((groupId)=>{
    const group = results[groupId];

    updatedGroupStore[`group-${group.id}`] = {
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
