import {Convention, Event, Group} from "../ObjectConfig.ts";

export interface SearchParams {
  day: string
}

export interface SearchData {
  groups:Group[],
  conventions:Convention[],
}

export function findResults(data:SearchData, searchParams:SearchParams){
  const searchDay = searchParams.day;

  //TODO: Add isDefaultMethod here.
  if (searchDay === "Any" || !searchDay) {
    return data;
  }

  const eventCopy = JSON.parse(JSON.stringify(data));
  const groupsToInclude: Group[] = [];

  eventCopy.groups.forEach((group: Group) => {
    const eventsToInclude: Event[] = [];
    group.events.forEach((event: Event) => {
      if (event.day === searchDay) {
        //TODO: Add other search parameters here.
        eventsToInclude.push(event);
      }
    });

    if (eventsToInclude.length > 0) {
      group.events = eventsToInclude;
      groupsToInclude.push(group);
    }
  });
  eventCopy.groups = groupsToInclude;
  return eventCopy;
}