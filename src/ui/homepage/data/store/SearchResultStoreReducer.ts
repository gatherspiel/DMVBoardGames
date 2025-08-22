export function searchResultReducer(searchResults: any) {

  console.log("Search results");
  console.log(searchResults);

  var results:any = searchResults?.groupData;
  const updatedResults: Record<string, any> = {};

  if(!results){
    return {};
  }
  Object.keys(results).forEach((groupId)=>{
    const group = results[groupId];

    updatedResults[`group-${group.id}`] = {
      events: group["events"],
      locations: group.cities || group.locations,
      url: group.url,
      title: group.name,
      summary: group.summary,
      isHidden: false,
    };
  });
  return updatedResults
}
