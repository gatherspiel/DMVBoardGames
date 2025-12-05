export class DataStoreDoc extends HTMLElement {
  connectedCallback(){
    this.innerHTML = `
     <h3>DataStore</h3>
          <p>This class is responsible for storing state and fetching data from an external source</p>
          <h4>Parameters</h4>
          <ul>
            <li><a href="#data-store-load-action-class-guide">loadAction: </a>An instance of DataStoreLoadAction describing how data should be loaded</li>
          </ul>
          <h4>Functions</h4>
          <ul>
            <li><b>updateStoreData(storeUpdates)</b>: Update data in the store and trigger a render of components
              subscribed to the store. Only fields specified by the store updates parameter will be modified.</li>
            <li><b>getStoreData</b>: Returns data from the store. The data is read-only and must be modified using
              updateStoreData.</li>
            <li><b>isWaitingForData</b>: Returns false if the data in the store is null or undefined and is
              not in a loading state, and returns false otherwise.</li>
            <li><b>fetchData(params,dataStore)</b>:This function retries data from an external source and then upgrades
              any subscribed stores.</li>
            <h5>Parameters</h5>
            <ul>
              <li><b>params:</b>Parameters for this request.</li>
              <li><b>dataStore:</b>An optional data store that will be subscribed to updates from this store.</li>
            </ul>
          </ul>
          <details open>
            <summary>Example</summary>
            <base-code-display-component>
import { ApiLoadAction, DataStore } from "@bponnaluri/places-js";
import { API_ROOT } from "../../ui/shared/Params.js";

function getUserQueryConfig() {
  return {
    url: API_ROOT + "/user",
  };
}

export const USER_DATA_STORE = new DataStore(
  new ApiLoadAction(getUserQueryConfig);
);

            </base-code-display-component>
          </details>
        </div>
    
 
    `
  }
}