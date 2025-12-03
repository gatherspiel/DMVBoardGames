
export class BaseDynamicComponentDoc extends HTMLElement {

  connectedCallback(){
    this.innerHTML = `

          <p>This is the base class for a state based UI component with support for asynchronous data fetching. It also
          has styles scoped to the ShadowDOM. All state based UI components using places.js should extend this class.</p>
        <!-- Format header -->
          <h4>Constructor paramaeters </h4>

          <ul>
            <li><b>dataStoreSubscriptions</b>: An optional array of subscription configurations the component will subscribe to.
              <h5>Parameters</h5>
            </li>
            <ul>
              <li><b>dataStore</b>: The <a href="#data-store-class-guide"> Data Store</a> that that will load and store state. </li>
              <li><b>fieldName</b>: The name that the subscribed data should be stored under. This is an optional field unless the component is subscribed to multiple stores.</li>
              <li><b><a href="#component-reducer-function-guide">componentReducer</a>:</b>Optional reducer
                function that defines any transformations that should be made to state data being sent to a component
                
    
                  
                <details open="true">
                  <summary>Example</summary>
                <code-display-component>
    export const componentReducer: (groupData) => {
      return {
        ...groupData,
        [SUCCESS_MESSAGE_KEY]: "",
      };
    },
                </code-display-component>
               </details>
                
                Read only state for the component can be accessed inside the component from the componentStore field.
              </li>
            </ul>
            <li><b>loadingIndicatorConfig</b>: Optional configuration settings for a loading indicator. When
              defined a loading indicator will be displayed when the component needs to load data from an external store.
              <h5>Parameters</h5>
            </li>
            <ul>
              <li><b>generateLoadingIndicatorHtml</b>: A function returning the HTML that should be shown.</li>
              <li><b>minTimeMs</b>: Optional setting minimum amount of time in miliseconds that the loading indicator will be shown for, regardless of
                  how quickly data is loaded for store subscriptions.  If this value is not specified, then the loading indicator
                  will be shown until the data has loaded.</li>
            </ul>

            <h5>Example</h5>
            
            <details open="true">
              <summary>Example</summary>
            <code-display-component>
    export const LOADING_INDICATOR_CONFIG = {
      generateLoadingIndicatorHtml: () => {
        return \`<p>Loading</p>\`;
      },
      minTimeMs: 500,
    };
            </code-display-component>
            </details>
            <h5><a href="#loading-indicator-component-detailed">Detailed example</a></h5>

          </ul>

          <!-- Make it clear that this is part of the BaseDynamicComponent class -->
          <h4>Functions </h4>
          <ul>
            <li><b>render(data)</b>: Required function used to render HTML for the component. The data parameter
              is a read-only representation of the component's store data.
                  <code-display-component>
    render(userData) {
      return \`
      <div id="login-status-container">
        <div id="links-container">
          <div id="\${SIGN_OUT_LINK_ID}">Sign out</div>

          <div id="edit-profile-div"><a href="/html/user/editProfile.html">Edit profile</a></div>
        </div>
        <div id="user-text-container">
          <div id="user-text-container-inner">
            <div id="user-text-container-filler"></div>
            <div id="user-image-container">
              \${userData.imageFilePath ? \`<img id="user-image-icon" src="\${userData.imageFilePath}"/>\` : \`\`}
            </div>
            <div id="username-container">
              <span>\${userData.username || this.getAttribute("email")}</span>
            </div>
          </div>
        </div>
      </div>
    \`;
    }
                  </code-display-component>
            </li>
            <li><b>getTemplateStyle</b>: Required function for defining a component's style. It can also load external
            stylesheets.
                <code-display-component>
                  getTemplateStyle() {
                    return \`
                    <link rel="stylesheet" type="text/css" href="/styles/sharedHtmlAndComponentStyles.css"/>

                    <style>
                      a {
                        color: white;
                        text-decoration: none;
                      }
                    </style>
                    \`;
                  }
                </code-display-component>
            </li>
            <li><b>attachHandlersToShadowRoot(shadowRoot)</b>: Use this function to define event handlers on a component.
                <code-display-component>
    attachHandlersToShadowRoot(shadowRoot) {
      shadowRoot.addEventListener("click", (event) => {
        if (event.target.id === SIGN_OUT_LINK_ID) {
          LOGOUT_STORE.fetchData({}, LOGIN_STORE);
        }
      });
    }

                </code-display-component>
            </li>
            <li><b>connectedCallback</b>: Standard web component lifecycle method. Use for initializing component state if it
              does not rely on an external store.
              <details>
                <summary>Example</summary>
                  <code-display-component>
    connectedCallback() {
      document.title = \`Add event for group ${new URLSearchParams(document.location.search).get("name") ?? ""}\`;
      this.updateData({
        name: "",
        groupName: new URLSearchParams(document.location.search).get("name") ?? ""
      });
    }
                  </code-display-component>
              </details>
            </li>
            <li><b>updateData(data)</b>Use this function to update the state of a component inside an event handler or
              connectedCallback. <b>Calling this method from another other location can lead to infinite rendering loops
              or other unpredictable effects.</b>
              <details>
                <summary>Example from event handler</summary>
                <code-display-component>
    const attachHandlersToShadowRoot = function (shadowRoot) {
      const self = this;

      queryForServerStatus();
      shadowRoot.addEventListener("click", (event) => {
      const targetId = event.target.id;
        if (targetId === RECURRING_EVENT_INPUT) {
          self.updateData({
            isRecurring: shadowRoot.getElementById(RECURRING_EVENT_INPUT)?.checked,
          });
      }
    }
                </code-display-component>
              </details>

            </li>
          </ul>

          <h4>Other notes</h4>
          <ul>
            <li>Note: The BaseDynamicComponent object uses the disconnectedCallback function to make sure store subscriptions are up to date when a component is disconnected.Overriding
            this method could lead to unpredicatable rendering behavior.</li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements">
              More information</a> about web component lifecycle methods.</li>
          </ul>
    
    `
  }
}