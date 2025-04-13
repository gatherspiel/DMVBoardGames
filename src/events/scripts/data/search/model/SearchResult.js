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
}
