import { BaseDynamicComponent } from "@bponnaluri/places-js";
import { LOADING_INDICATOR_CONFIG } from "../../shared/LoadingIndicatorConfig.js";
import { LOGIN_STORE } from "../../data/user/LoginStore.js";
import { SEARCH_RESULTS_LIST_STORE } from "../../data/list/SearchStores.js";
import { generateLinkButton } from "../../shared/html/ButtonGenerator.js";
import { getDisplayName } from "../../shared/DisplayNameConversion.js";

export class GroupListComponent extends BaseDynamicComponent {
  constructor() {
    super(
      [
        {
          dataStore: SEARCH_RESULTS_LIST_STORE,
          fieldName: "data",
        },
        {
          dataStore: LOGIN_STORE,
          fieldName: "loginStatus",
        },
      ],
      LOADING_INDICATOR_CONFIG,
    );
  }

  getTemplateStyle() {
    return `
      <link rel="preload" as="style" href="/styles/sharedHtmlAndComponentStyles.css" onload="this.rel='stylesheet'"/>
      <style>
       li {
          padding-bottom: 1rem;
          padding-top:1rem;
        }
        h1 {
          font-size: 3rem;
        }
        ul {
          list-style:url(/assets/images/meeple_small.png);
          margin-top:0;
          padding-left:1.5rem;
        }
        .button-div {
          display: flex;
        }
        .group-search-details {
          display:block;
          padding-top:0.5rem;
        }
        .section-separator-small {
          margin-left:-1rem;
        }
        @media not screen and (width < 32em) {
          .group-cities {
            display: inline-block;
            margin-left: 2rem;
          }
          .raised {
            display: inline-block;
          }
          #group-search-results-header {
            padding-left:1.5rem;
          }
        }  
        @media screen and (width < 32em) {
          a {
            margin-top: 1rem;
          }
          #group-search-results-header {
            text-align: center;
          }
          .group-cities {
            display: none; 
          }
          .ui-section .event-group:not(:first-child) {
            margin-top: 0.5rem;
          }
          .raised {
            margin-top: 0.5rem;

          }
        } 
      </style>
    `;
  }

  getItemHtml(group, loggedIn) {
    const groupCitiesStr =
      group.cities && group.cities.length > 0
        ? group.cities.map((name) => getDisplayName(name))?.join(", ")
        : "DMV Area";

    const hasRecurringEventDays = group.recurringEventDays.length > 0;
    const hasGameTypeTags = group.gameTypeTags.length > 0;

    return `
      <li>
        ${generateLinkButton({
          text: group.name,
          url: `${hasRecurringEventDays || loggedIn || hasGameTypeTags ? `/html/groups/groups.html?name=${encodeURIComponent(group.name)}` : `${group.url}`}`,
        })}
        <span class="group-cities">${groupCitiesStr}</span>           
        ${hasRecurringEventDays ? `<span class="group-search-details"><b>Days:</b> ${group.recurringEventDays.join(", ")}</span>` : ``}  
        ${hasGameTypeTags ? `<span class="group-search-details"><b>Game types:</b> ${group.gameTypeTags.join(", ")}</span>` : ``}  
      </li>
    `;
  }
  render(state) {
    if (state?.status === "Waiting for user input" || !state.data.groupData) {
      return ``;
    }

    if (state.data.groupData.length === 0) {
      return `
          <p>No groups found</p>
          <div class="section-separator-small"></div> 
        `;
    }
    let html = `
      <div class="fade-in-animation">
      <h1 id="group-search-results-header">Search results</h1>
      <ul>`;
    for (let i = 0; i < state.data.groupData.length; i++) {
      html += `
          ${this.getItemHtml(state.data.groupData[i], state.loginStatus.loggedIn)}
          <div class="section-separator-small"></div> 
      `;
    }
    return html + `</ul></div>`;
  }
}
