export class ApiLoadActionDoc extends HTMLElement {
  connectedCallback(){
    this.innerHTML = `
      <h3>ApiLoadAction</h3>
          <p>Class to define a data store load action through an API call.</p>

          <h4>Constructor parameters</h4>
          <ul>
            <li><b>getRequestConfig</b>: Function that returns a JSON configuration.
              <a href="#data-store-load-config-info">More information about configuration fields</a>
            </li>
          </ul>

          <h4>Implementation notes</h4>
          <ul>
            <li>Auth token data sorted in session storage is automatically included if it is in the field
              "authToken.accessToken".</li>
            <li>Data retrieved with a GET request is cached based on the URL and request body. Cached API response
              data is automatically cleared when any other request type is used.</li>
          </ul>

          <details open>
            <summary>Example</summary>
            <code-display-component>
function getCitiesQueryConfig() {
  return {
    url: API_ROOT + "/listCities?area=dmv",
  };
}

export const CITY_LIST_STORE = new DataStore(
 new ApiLoadAction(getCitiesQueryConfig),
);
            </code-display-component>
          </details>
    `
  }
}