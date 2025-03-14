import { DEFAULT_SEARCH_PARAMETER } from "../EventSearch.js";

export class SearchParams {
  constructor(params) {
    this.day = params.day;
    this.location = params.location;
  }

  isDefault() {
    return (
      (this.day === DEFAULT_SEARCH_PARAMETER || !this.day) &&
      (this.location === DEFAULT_SEARCH_PARAMETER || !this.location)
    );
  }
}
