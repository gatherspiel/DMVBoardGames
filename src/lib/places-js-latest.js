function clearSessionStorage(){
  for(let i = 0; i< sessionStorage.length; i++){
    const key = sessionStorage.key(i);
    sessionStorage.setItem(key, JSON.stringify({}));
  }
}

function getItemFromSessionStorage(requestStoreName, requestData){

  const dataStr = sessionStorage.getItem(requestStoreName);
  if(!dataStr){
    return null;
  }

  const data = JSON.parse(dataStr);

  if(!(Object.keys(data).length === 0) && requestData in data){
    return data[requestData];
  }
  return null;
}

function updateSessionStorage(requestStoreName, requestData, response){

  const dataStr = sessionStorage.getItem(requestStoreName);
  if(!dataStr){
    throw new Error(`No cache defined for ${requestStoreName}`)
  }

  const data = JSON.parse(dataStr);
  data[requestData] = response;

  sessionStorage.setItem(requestStoreName, JSON.stringify(data));
}

/** Freeze state to prevent direct modification.
 * @param state State that should be frozen.
 * @private
 */
function freezeState(state){
  if(!state || JSON.stringify(state)==='{}'){
    return {};
  }
  for (let [key, value] of Object.entries(state)) {
    if (state.hasOwnProperty(key) && typeof value == "object") {
      freezeState(value);
    }
  }
  return Object.freeze(state);
}

class DataStoreLoadAction {
  fetch(params, cacheKey){
    throw new Error(`fetch(params, cacheKey) method must be defined for ${this.constructor.name}`);
  }
}

class DataStore {

  static #storeCount = 0;

  #componentSubscriptions = [];
	#isLoading = false; 
  #loadAction;
  #requestStoreId;
	#storeData = null;

  constructor(loadAction) {
    this.#loadAction = loadAction;
    this.#componentSubscriptions = [];
    this.#requestStoreId = `data-store-${DataStore.#storeCount}`;
    
		sessionStorage.setItem(this.#requestStoreId, JSON.stringify({}));
    DataStore.#storeCount++;
  }

  /**
   * Returns data from the store.
   * @returns A JSON object representing an immutable copy of store data.
   */
  getStoreData() {
    return this.#storeData;
  }

  /**
   * @returns {boolean} false if the data in the store is null or undefined and is not in a loading state true otherwise.
   */
  hasLatestData() {
    return this.#storeData !== null && this.#storeData !== undefined  && !this.#isLoading;
  }

  /**
   * Update data in the store and trigger a render of components subscribed to the store.
   * @param storeUpdates Updated store data. Fields not specified in storeData will not be updated.
   */
  updateStoreData(storeUpdates){
    this.#storeData = {...this.#storeData,...freezeState(storeUpdates)};
    for(let i = 0; i < this.#componentSubscriptions.length; i++){
      this.#componentSubscriptions[i].updateFromSubscribedStores();
    }
  }

  getSubscribedComponents(){
    return this.#componentSubscriptions;
  }

  /**
   * Retrieves data from an external source.
   * @param params Parameters for the request.
   * @param dataStore Optional data store that will be subscribed to updates from this store.
   */
  async fetchData(params = {}, dataStore){

    const self = this;

    // Do not make a data request if there is an active one in progress. The active one will push data to subscribed components.
    if(!this.#isLoading) {
      this.#isLoading = true;

      const requestConfig = this.#loadAction.getRequestConfig ? this.#loadAction.getRequestConfig(params) : {};

      let response = null;
      let requestKey = null;
      
      // Retrieve cached response if one exists.
			if(self.#requestStoreId || self.#requestStoreId.length > 0){
        requestKey = `${requestConfig.method ?? ''}_${requestConfig.url}_${JSON.stringify(requestConfig.body) ?? ''}`;
        response = getItemFromSessionStorage(this.#requestStoreId, requestKey);
      }

      // Make an API call if a cached response does not exist.
      if(response === null) {
        //Replace component with loading indicator if one exists.
        for (let i = 0; i < self.#componentSubscriptions.length; i++) {
          self.#componentSubscriptions[i].lockComponent(self);
        }
        if (dataStore) {
          const dataStoreSubscribedComponents = dataStore.getSubscribedComponents();
          for (let i = 0; i < dataStoreSubscribedComponents.length; i++) {
            dataStoreSubscribedComponents[i].lockComponent(dataStore);
          }
        }
        response = await this.#loadAction.fetch(params, self.#requestStoreId,requestKey); 
      } 
      
			self.#storeData = response;
      self.#isLoading = false;

      for(let i = 0; i < self.#componentSubscriptions.length; i++){
        self.#componentSubscriptions[i].unlockComponent(self);
        self.#componentSubscriptions[i].updateFromSubscribedStores();
      }

      if(dataStore){
        const dataStoreSubscribedComponents = dataStore.getSubscribedComponents();
        for(let i = 0; i < dataStoreSubscribedComponents.length; i++){
          dataStoreSubscribedComponents[i].unlockComponent(dataStore);
        }
        dataStore.updateStoreData(response);
      }
      return response;
    }
  }

  unsubscribeComponent(component){
    const idx = this.#componentSubscriptions.indexOf(component);
    if(idx === -1){
      console.warn(`Attempt to unsubscribe ${component.constructor.name} from store it is not subscribed to`);
      return;
    }
    this.#componentSubscriptions.splice(idx, 1);
  }

  subscribeComponent(component){

    let i = 0;
    while(i < this.#componentSubscriptions.length){
      if(this.#componentSubscriptions[i] === component){
        this.#componentSubscriptions = this.#componentSubscriptions.splice(i, 1);
        break;
      }
      i++;
    }
    this.#componentSubscriptions.push(component);

    if(!this.hasLatestData()){
      this.fetchData();
    }
  }
}

class BaseDynamicComponent extends HTMLElement {

  #attachedEventsToShadowRoot = false;
  #componentIsRendering = false;
  #loadingFromStores = new Set();
  #loadingStarted = 0;
  #loadingIndicatorConfig;
  #subscribedStores = [];

	//Stores state for the component.
  componentStore = {};

	/**
	 * @param dataStoreSubscriptions - An array of data stores the component should
	 * subscribe to.
	 * @param loadingIndicatorConfig - Configuration for a custom loading
	 * indicator.
	 **/
  constructor(dataStoreSubscriptions = [], loadingIndicatorConfig) {
    super();

    if(loadingIndicatorConfig){
      this.#loadingIndicatorConfig = loadingIndicatorConfig;
    }

    //Performance optimization if component is not subscribed to data stores.
    if(dataStoreSubscriptions.length === 0) {
      this.updateData({});
      return;
    }
		
    // Make sure component is subscribed to data stores.
    this.#subscribedStores = dataStoreSubscriptions;
    for(let i=0;i <this.#subscribedStores.length;i++){
      this.#subscribedStores[i].dataStore.subscribeComponent(this);
    }

    this.updateFromSubscribedStores();
  }

	/**
	 * Shows custom loading indicator if it exists. This custom loading indicator
	 * replaces UI components and disables any user events.
	 **/
  lockComponent(dataStore){

    if(!this.#loadingFromStores.has(dataStore)){
      this.#loadingFromStores.add(dataStore);
    } else {
      console.warn(`Attempting to lock component ${this.constructor.name} multiple times`);
    }

		// Save the timestamp for when the loading started.
    if(this.#loadingStarted === 0){
      this.#loadingStarted = Date.now();
    }

    if(this.#loadingIndicatorConfig){
      if (this.shadowRoot === null) {
        this.attachShadow({ mode: "open" });
        const template = document.createElement("template");
        this.shadowRoot.appendChild(template.content.cloneNode(true));
      }
      // @ts-ignore
      this.shadowRoot.innerHTML =
        this.getTemplateStyle() + this.#loadingIndicatorConfig.generateLoadingIndicatorHtml();
    }
  }

  unlockComponent(dataStore) {
    this.#loadingFromStores.delete(dataStore);
  }

	/**
	 * Unsubscribe component when it is removed from the UI.
	 **/
  disconnectedCallback(){
    for(let i = 0; i < this.#subscribedStores.length; i++){
      this.#subscribedStores[i].dataStore.unsubscribeComponent(this);
    }
  }

	/**
	 * Update component with state data
	 **/
  updateData(storeUpdates) {

    if(this.#componentIsRendering){
      console.warn(`Attempting to trigger multiple renders at the same time on component ${this.constructor.name}`);
    }

    if (!storeUpdates) {
      return;
    }

    this.#componentIsRendering = true;
    this.componentStore = {...this.componentStore,...freezeState(storeUpdates)};
    this.#generateAndSaveHTML(this.componentStore);

    if(this.shadowRoot){
      if(this.attachHandlersToShadowRoot && !this.#attachedEventsToShadowRoot){
        this.attachHandlersToShadowRoot(this.shadowRoot);
        this.#attachedEventsToShadowRoot = true;
      }
    }

    this.#componentIsRendering = false;
  }

  updateFromSubscribedStores() {

    let allSubscribedStoresHaveData = true;
    for(let i = 0; i < this.#subscribedStores.length; i++){
      allSubscribedStoresHaveData = 
				allSubscribedStoresHaveData &&
        (this.#subscribedStores[i].dataStore.hasLatestData());
    }

		// Make sure a component state is updated only when all the subscribed
		// stores have data 
    if(allSubscribedStoresHaveData){

      let dataToUpdate = {};
      for(let i =0; i < this.#subscribedStores.length; i++){

        const item = this.#subscribedStores[i];
        let storeData = item.dataStore.getStoreData();
        if(item.componentReducer){
          storeData = item.componentReducer(storeData);
        }

        if(item.fieldName) {
          dataToUpdate[item.fieldName] = storeData;
        } else {
          dataToUpdate = storeData;
          if(this.#subscribedStores?.length > 1){
            throw new Error(`Component ${this.constructor.name} is subscribed to multiple data stores. 
              Each one must be associated with a specified field name`)
          }
        }
      }
      this.updateData(
        dataToUpdate,
      );
    }
  }

  #generateAndSaveHTML(data) {
    if (this.shadowRoot === null) {
      this.attachShadow({ mode: "open" });
      const template = document.createElement("template");
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    if(this.#loadingStarted > 0){
      const current = Date.now();
      const loadTime = current - this.#loadingStarted;

      console.log(`Loaded data for ${this.constructor.name} in ${loadTime} milliseconds`);
      this.#loadingStarted = 0;
      
			//Handle case where loading indicator is configured to stay visible for a
			//minimum amount of time.
			if(this.#loadingIndicatorConfig?.minTimeMs){
        const remainingTime = this.#loadingIndicatorConfig.minTimeMs - loadTime;

        const self = this;
        if(remainingTime > 0){
          setTimeout(()=>{
            self.shadowRoot.innerHTML = this.getTemplateStyle() + this.render(data);
          },remainingTime);
        } else {
          this.shadowRoot.innerHTML = this.getTemplateStyle() + this.render(data);
        }
      } else {
        this.shadowRoot.innerHTML = this.getTemplateStyle() + this.render(data);
      }
    }
    else {
      this.shadowRoot.innerHTML = this.getTemplateStyle() + this.render(data);
    }
  }

  render(data){
    throw new Error(`render(data) function for ${this.constructor.name} must be defined` )
  }

  /*
		Returns CSS styles specific to the component. The string should be in the format <style> ${CSS styles} </style>
  */
  getTemplateStyle(){
    throw new Error(`getTemplateStyle function for ${this.constructor.name} must be defined` )
  }
}

class BaseTemplateComponent extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });

    const shadowRoot = this.shadowRoot;
    if (!shadowRoot) {
      throw new Error("shadowRoot is not defined");
    }

    const templateStyle = this.getTemplateStyle();
    const template = document.createElement("template");
    template.innerHTML = templateStyle + `<div></div>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const div = this.shadowRoot?.querySelector("div");
    if (!div) {
      throw new Error("Failed to create template with a <div></div> section");
    }

    div.innerHTML = this.render();

    if(this.attachEventHandlersToDom){
      this.attachEventHandlersToDom(this.shadowRoot);
    }
  }

}

const ApiActionType = Object.freeze({
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
});

function getLocalStorageDataIfPresent(key) {
  const data = window.localStorage.getItem(key);
  return data ? JSON.parse(data): null;
}

function addLocalStorageData(key, data){
  window.localStorage.setItem(key, data);
}

function deleteLocalStoreData(key){
  if(window.localStorage.getItem(key)){
    window.localStorage.removeItem(key);
  }
}

/**
 * Class to define a data store load action through an API call.
 */
class ApiLoadAction extends DataStoreLoadAction {

  #getRequestConfig;

  constructor(getRequestConfig) {
    super();
    this.#getRequestConfig = getRequestConfig;
  }

  getRequestConfig(params){
    return this.#getRequestConfig(params);
  }
  
	/**
   * @param params API request parameters
   * @param cacheKey
   * @param requestKey
   */
  async fetch(params, cacheKey, requestKey){

    const queryConfig = this.#getRequestConfig(params);

    if(!queryConfig.headers){
      queryConfig.headers = {};
    }

    const response = await ApiLoadAction.getResponseData(
      queryConfig,
    );

    if(cacheKey && requestKey){
      if(queryConfig.method && queryConfig.method !== ApiActionType.GET){
        clearSessionStorage();
      }
      updateSessionStorage(cacheKey, requestKey, response);
    }
    return response;
  }

  static async #getErrorData(response, url) {

    let message;

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      message = await response.json();
    } else {
      if (response.status === 404) {
        message = `Endpoint ${url} not found`;
      } else {
        message = await response.text();
      }
    }

    return {
      status: response.status,
      errorMessage: message,
      endpoint: url,
    };
  }

  /**
   * Directly make an API request and return the data. Use this method if the API request needs
   * to be run as part of an event handler and no other components subscribe to the request.
   * Cache data will not be used or updated.
   *
   * @param {ApiRequestConfig} queryConfig Configuration of the API request.
   */
  static async getResponseData(queryConfig){

    const authData = getLocalStorageDataIfPresent("authToken")?.access_token;

    if (authData) {
      if(queryConfig.headers){
        queryConfig.headers["authToken"] = authData;
      } else {
        queryConfig.headers = {
          "authToken": authData
        };
      }
    }

    try {

      //The replace call is a workaround for an issue with url strings containing double quotes.
      const response = await fetch(queryConfig.url.replace(/"/g, ""), {
        method: queryConfig.method ?? ApiActionType.GET,
        headers: queryConfig.headers,
        body: queryConfig.body,
      });

      if (response.status !== 200) {
        return await this.#getErrorData(response,queryConfig.url)
      }

      const contentType = response.headers.get("content-type");
      if (contentType === "application/json") {
        return await response.json();
      }

      //Clear cache because there was a likely data update.
      if(queryConfig.method !== ApiActionType.GET){
        console.log("Clearing response cache and other data in session storage");
        clearSessionStorage();
      }
      return { status: 200 };
    } catch (e) {
      return {errorMessage:e.message};
    }
  }
}

/**
 * Class to define a custom data store load action with direct control over any async calls that are made.
 * It is intended for use when additional processing needs to be done after an async call, or if a store needs
 * to combine data from multiple sources.
 */
class CustomLoadAction extends DataStoreLoadAction {

  #loadFunction;

  constructor(loadFunction) {
    super();
    this.#loadFunction = loadFunction;
  }

  async fetch(params) {
    return await this.#loadFunction(
      params,
    );
  }
}

export { ApiActionType, ApiLoadAction, BaseDynamicComponent, BaseTemplateComponent, CustomLoadAction, DataStore, DataStoreLoadAction, addLocalStorageData, clearSessionStorage, deleteLocalStoreData, getLocalStorageDataIfPresent };
