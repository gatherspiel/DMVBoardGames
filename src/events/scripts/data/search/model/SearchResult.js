import {
  DEFAULT_SEARCH_PARAMETER,
  UNDEFINED_EVENT_LOCATION_PARAMETER,
} from "../EventSearch.js";

export class SearchResult {
  constructor(groups) {
    this.groups = JSON.parse(JSON.stringify(groups));
  }

  static getEvents(groups) {
    let events = [];
    groups.forEach((group) => {
      const groupEvents = group.data.events;
      const eventCount = Object.keys(groupEvents).length;
      if (eventCount > 0) {
        events = events.concat(Object.values(groupEvents));
      }
    });
    return events;
  }

  static countEvents(groups) {
    return this.getEvents(groups).length;
  }

  static getEventIds(groups) {
    const ids = new Set();
    this.getEvents(groups).forEach((event) => {
      ids.add(event.id);
    });
    return ids;
  }

  filterResults(searchParams) {
    const groupsToInclude = [];
    const searchDay = searchParams.day;
    const searchLocation = searchParams.location;

    this.groups.forEach((group) => {
      const eventsToInclude = [];
      group.data.events.forEach((event) => {
        if (this.eventMatch(event, searchParams, group)) {
          eventsToInclude.push(event);
        }
      });

      if (eventsToInclude.length > 0) {
        group.data.events = eventsToInclude;
        groupsToInclude.push(group);
      } else if (
        group.data.locations &&
        searchLocation !== DEFAULT_SEARCH_PARAMETER &&
        group.data.locations.includes(searchLocation) &&
        searchDay === DEFAULT_SEARCH_PARAMETER
      ) {
        groupsToInclude.push(group);
      }
    });
    this.groups = groupsToInclude;
    this.groups.forEach(function (group) {
      group["frontendState"]["visibleEvents"] = group.data.events;
    });
  }

  eventMatch(event, searchParams, group) {
    let dayMatch = false;
    if (
      searchParams.day === event.day ||
      searchParams.day === DEFAULT_SEARCH_PARAMETER
    ) {
      dayMatch = true;
    }

    let location = event.location;
    if (
      !event.location ||
      event.location === UNDEFINED_EVENT_LOCATION_PARAMETER
    ) {
      location = group.data.locations;
    }
    let locationMatch = false;
    if (
      location.includes(searchParams.location) ||
      searchParams.location === DEFAULT_SEARCH_PARAMETER
    ) {
      locationMatch = true;
    }
    return dayMatch && locationMatch;
  }
}
