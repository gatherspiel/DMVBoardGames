import { PresentationComponent } from "/lib/places-js-latest.js";
import { SEARCH_COMPONENT_STORE } from "../../data/list/SearchComponentStore.js";
import { SEARCH_RESULTS_STORE } from "../../data/list/SearchResultsStore.js";

import { getDaysOfWeekSelectState } from "../../shared/html/SelectGenerator.js";

import { searchWithDefaultParams } from "../../data/list/SearchResultsStore.js";

export class SearchComponent extends PresentationComponent {
  constructor() {
    super();

		//Performance optimizaiton if the "api-url" attribute is available before connectedCallback is called.
		const searchUrl = this.getAttribute("api-url") ?? (window.location.href.contains("searchGroups") ? "/searchGroups" : "/searchEvents");
    SEARCH_COMPONENT_STORE.fetchData();
    searchWithDefaultParams(searchUrl);
    
		this.setAttribute("search-button-enabled", false);

    const checkboxUpdated = () => {
      this.setAttribute("search-button-enabled", true);
    };

    const distanceUpdated = () => {
      this.setAttribute("search-button-enabled", true);
    };

    const citiesUpdated = () => {
      this.setAttribute("search-button-enabled", true);
    };

    this.setChangeEvents({
      citiesUpdated: citiesUpdated,
      checkboxUpdated: checkboxUpdated,
      distanceUpdated: distanceUpdated,
    });

    const searchEvents = () => {
      this.setAttribute("search-button-enabled", false);

      const searchParams = {
        location: document.getElementById(`select-city`).value ?? "",
        days: getDaysOfWeekSelectState("#select-days").join(","),
        distance: document.getElementById(`select-distance`).value ?? "",
      };


      const baseUrl = window.location.origin.split("?");
      let updatedUrl = `${baseUrl}?`;
      updatedUrl += `location=${searchParams.location.replaceAll(" ", "_")}&`;
      updatedUrl += `days=${searchParams.days.replaceAll(" ", "_")}&`;
      updatedUrl += `distance=${searchParams?.distance?.replaceAll(" ", "_") ?? ``}`;

      window.history.replaceState({}, "", updatedUrl);


      SEARCH_RESULTS_STORE.fetchData({
        ...searchParams,
        ...{ apiUrl: searchUrl ?? "" },
      });
    };

    const searchGroups = (e, component) => {
      searchEvents(e, component, true);
    };

    this.setClickEvents({
      searchEvents: searchEvents,
      searchGroups: searchGroups,
    });
  }
}
