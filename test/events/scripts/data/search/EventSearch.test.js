import { describe, it } from "node:test";
import assert from "node:assert";
import {
  countEvents,
  getEventIds,
  getSearchResultGroups,
} from "../../../../../src/events/scripts/data/search/search.js";
import {
  ARLINGTON_SEARCH,
  DEFAULT_SEARCH_PARAMS,
  GROUP_LIST_1,
  GROUP_LIST_2,
  INVALID_DAY_SEARCh,
  WEDNESDAY_SEARCH,
} from "./Fixtures.js";

describe("Event Search tests", () => {
  it("Should return empty result when there are no groups", () => {
    const groups = getSearchResultGroups({}, DEFAULT_SEARCH_PARAMS);
    assert.strictEqual(groups.length, 0, "Number of events is not correct");
  });

  it("Should return all events when the default search parameters are specified", () => {
    const groups = getSearchResultGroups(GROUP_LIST_1, DEFAULT_SEARCH_PARAMS);
    assert.strictEqual(groups.length, 3, JSON.stringify(groups));
    assert.strictEqual(
      countEvents(groups),
      2,
      "Number of events is not correct",
    );

    const expectedIds = new Set([1, 2]);
    const eventIds = getEventIds(groups);
    assert.strictEqual(expectedIds.intersection(eventIds).size, 2);
  });

  it("Correct events are returned when location is specified and day is not", () => {
    const groups = getSearchResultGroups(GROUP_LIST_2, ARLINGTON_SEARCH);
    assert.strictEqual(groups.length, 7, JSON.stringify(groups));
    assert.strictEqual(
      countEvents(groups),
      4,
      "Number of events is not correct",
    );

    const expectedIds = new Set([1, 2, 4, 6]);
    const eventIds = getEventIds(groups);
    assert.strictEqual(
      expectedIds.intersection(eventIds).size,
      4,
      JSON.stringify(Array.from(expectedIds.intersection(eventIds))),
    );
  });

  it("Correct events are returned when day is specified and location is not", () => {
    const groups = getSearchResultGroups(GROUP_LIST_2, WEDNESDAY_SEARCH);
    assert.strictEqual(groups.length, 5, JSON.stringify(groups));
    assert.strictEqual(
      countEvents(groups),
      6,
      "Number of events is not correct",
    );

    const expectedIds = new Set([4, 1, 3, 6, 8, 10]);

    const eventIds = getEventIds(groups);
    assert.strictEqual(
      expectedIds.intersection(eventIds).size,
      6,
      JSON.stringify(Array.from(expectedIds.intersection(eventIds))) +
        Array.from(eventIds),
    );
  });

  it("No events are returned when day is invalid", () => {
    const groups = getSearchResultGroups(GROUP_LIST_2, INVALID_DAY_SEARCh);
    assert.strictEqual(groups.length, 0, JSON.stringify(groups));
    assert.strictEqual(
      countEvents(groups),
      0,
      "Number of events is not correct",
    );
  });

  /*
  -Invalid day
  -Invalid location
  -Both day and location are specified.
   */
});
