import { describe, it } from "node:test";
import assert from "node:assert";
import {
  findResults,
  getSearchResultGroups,
} from "../../../../../src/events/scripts/data/search/search.js";
import { DEFAULT_SEARCH_PARAMS, GROUP_LIST_1 } from "./Fixtures.js";

describe("Event Search tests", () => {
  it("Should return empty result when there are no groups", () => {
    const results = findResults({}, DEFAULT_SEARCH_PARAMS);
  });

  it("Should return all events when the default search parameters are specified", () => {
    const results = findResults(GROUP_LIST_1, DEFAULT_SEARCH_PARAMS);
    const groups = getSearchResultGroups(results);
    assert.strictEqual(groups.length, 3, JSON.stringify(groups));
  });
});
