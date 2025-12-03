import {BaseDynamicComponent} from "@bponnaluri/places-js";

export class MainComponent extends BaseDynamicComponent {

  constructor(){
    super();
  }

  attachHandlersToShadowRoot(shadowRoot) {
    const currentUrl = window.location.href.split('?')[0]

    let shouldChangeUrl = false;
    shadowRoot.addEventListener("click",()=>{
      console.log("click");
      shouldChangeUrl = true;
    })

    shadowRoot.querySelectorAll("#container > details").forEach((item)=>{
      item.addEventListener("toggle",(event)=>{

        if(shouldChangeUrl){
          const url = new URL(location);

          if(event.newState === "open"){
            url.searchParams.set(event.target.id, "show")
            window.history.pushState({},'',`${currentUrl}?${event.target.id}=show`)
          } else {
            window.history.pushState({},'', currentUrl)

          }
          shouldChangeUrl = false;
        }

      })
    })
  }
  getTemplateStyle() {
    return `
      <style>
        #container > details > summary {
          font-weight: 600;
        }

        #container > details details > summary {
          margin-left: 1rem;
        }
        
        #guidelines-list li {
          margin-top:1rem;
        }
    
        .summary-level-one {
          font-size:1.5rem;
          margin-top:1rem;
        }
    
        @media screen and (width < 32em) {
          ul {
            padding:0;
          }
        }
      </style>`
  }

  render() {

    const urlParams = new URLSearchParams(document.location.search);

    console.log(urlParams.get("base-dynamic-component-details"))
    return `
      <div id="container">
        <h2>Classes</h2>
  
        <details id="base-dynamic-component-details" ${urlParams.get("base-dynamic-component-details") ? "open" : ''}>
          <summary>
            BaseDynamicComponent
          </summary>
          <base-dynamic-component-doc></base-dynamic-component-doc>
  
        </details>
  
        <details id="base-template-component-details" ${urlParams.get("base-template-component-details") ? "open" : ''}>
          <summary>
            BaseTemplateComponent
          </summary>
          <base-template-component-doc></base-template-component-doc>
        </details>
  
        <details id="data-store-details" ${urlParams.get("data-store-details") ? "open" : ''}>
          <summary>
            DataStore
          </summary>
          <data-store-doc></data-store-doc>
        </details>
  
        <details id="api-load-action-details" ${urlParams.get("api-load-action-details") ? "open" : ''}>
          <summary>
            ApiLoadAction
          </summary>
          <api-load-action-doc></api-load-action-doc>
        </details>
  
        <details id="custom-load-action-details" ${urlParams.get("custom-load-action-details") ? "open" : ''}>
          <summary>
            CustomLoadAction
          </summary>
          <custom-load-action-doc></custom-load-action-doc>
        </details>
  
        <details id="data-store-load-action-details" ${urlParams.get("data-store-load-action-details") ? "open" : ''} >
          <summary>
            DataStoreLoadAction
          </summary>
          <h3>DataStoreLoadAction</h3>
          <p>This class defines an action used to load data into a store. Places.js includes two types of actions</p>
          <ul>
            <li><a href="#api-load-action-class-guide">APILoadAction</a></li>
            <li><a href="#custom-load-action-class-guide">CustomLoadAction</a></li>
          </ul>
        </details>
  
        <h2>Objects</h2>
  
        <details id="api-action-type-details" ${urlParams.get("api-action-type-details") ? "open" : ''} >
          <summary>
            ApiActionType
          </summary>
          <p>Stores string representations for DELETE, GET, POST, and PUT API actions. </p>
        </details>
  
        <details id="data-store-load-config-details" ${urlParams.get("data-store-load-config-details") ? "open" : ''}>
          <summary>
            DataStoreLoadConfig
          </summary>
          <div id="data-store-load-config-info">
            <p>Configuration settings describing how a data store can be loaded from an API.</p>
            <ul>
              <li><b>url</b>: Required field representing the URL for the API request</li>
              <li><b>headers</b>: A list of headers included with the request.</li>
              <li><b>method</b>: The API request method, GET, PUST, POUT, ...etc. GET will be used by default if
                no value is specified for this field.</li>
              <li><b>body</b>: Data that should be sent as part of the request body.</li>
            </ul>
          </div>
        </details>
  
        <details id="functions-details" ${urlParams.get("functions-details") ? "open" : ''}>
          <summary class="summary-level-one">Functions</summary>
          <h3>clearSessionStorage</h3>
  
          <p>Clear GET API request cache and other data in session storage.</p>
  
          <h3>addLocalStorageData()</h3>
          <p>Adds auth data to session storage. This allows the data to be used in API requests. The access token
            should be stored with the field "accessToken".</p>
  
          <h3>deleteLocalStorageData(key)</h3>
          <p>Deletes data from local storage</p>
  
          <h3>getLocalStorageDataIfPresent(key)</h3>
          <p>Retrieves data from local storage if present.</p>
  
          <h3>getResponseData(DataStoreLoadConfig></h3>
          <p>Retrieves data from an API. See <a href="#data-store-load-config-info">DataStoreLoadConfig info</a>
            for more information about the parameters</p>
        </details>
  
  
        <h2>Examples</h2>
  
        <details id="show-hide-component-details" ${urlParams.get("show-hide-component-details") ? "open" : ''}>
          <summary>Show hide component</summary>
          <show-hide-component-guide></show-hide-component-guide>
        </details>
  
        <details id="loading-indicator-component-details" ${urlParams.get("loading-indicator-component-details") ? "open" : ''}>
          <summary>Loading indicator component</summary>
          <loading-indicator-component-guide></loading-indicator-component-guide>
        </details>
  
        <details id="guidelines-details" ${urlParams.get("guidelines-details") ? "open" : ''}>
            <summary class="summary-level-one">Guidelines for use</summary>
          <guidelines-component></guidelines-component>
        </details>
      </div>
    `
  }
}