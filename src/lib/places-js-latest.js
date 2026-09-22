/*
 * Don't iniitalize directly. use DataStore.createApiLoadSignal instead
 **/
class ApiLoadAction {
  constructor(getRequestConfig) {
    this.getRequestConfig = getRequestConfig;
  }

  /**
   * @param params API request parameters
   * @param cacheKey
   * @param requestKey
   */
  async fetch(params, cacheKey, requestKey) {
    const queryConfig = this.getRequestConfig(params);

    if (!queryConfig.headers) {
      queryConfig.headers = {};
    }

    const response = await ApiLoadAction.getResponseData(queryConfig);

    if (cacheKey && requestKey) {
      if (queryConfig?.method !== "GET") {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          sessionStorage.setItem(key, JSON.stringify({}));
        }
      }

      const data = JSON.parse(sessionStorage.getItem(cacheKey));
      data[requestKey] = response;
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
    }
    return response;
  }

  static async #getErrorData(response, url) {
    const contentType = response.headers.get("content-type");
    let message;
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
  static async getResponseData(queryConfig) {
    let authData = null;

    const data = window.localStorage.getItem("authToken");
    if (data) {
      authData = JSON.parse(data).access_token;
    }

    if (authData) {
      if (queryConfig.headers) {
        queryConfig.headers["authToken"] = authData;
      } else {
        queryConfig.headers = {
          authToken: authData,
        };
      }
    }

    try {
      //The replace call is a workaround for an issue with url strings containing double quotes.
      const response = await fetch(queryConfig.url.replace(/"/g, ""), {
        method: queryConfig.method ?? "GET",
        headers: queryConfig.headers,
        body: queryConfig.body,
      });

      if (response.status !== 200) {
        return await this.#getErrorData(response, queryConfig.url);
      }

      const contentType = response.headers.get("content-type");
      if (contentType === "application/json") {
        return await response.json();
      }

      //Cjlear cache because there was a likely data update.
      if (queryConfig.method !== "GET") {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          sessionStorage.setItem(key, JSON.stringify({}));
        }
      }
      return { status: 200 };
    } catch (e) {
      return { errorMessage: e.message };
    }
  }
}

/**
 * Class to define a custom data store load action with direct control over any async calls that are made.
 * It is intended for use when additional processing needs to be done after an async call, or if a store needs
 * to combine data from multiple sources.
 */
class CustomLoadSignal {
  constructor(loadFunction) {
    this.fetch = async (params) => {
      return await loadFunction(params);
    };
  }
}

/**
 * Class to determine a custom load action that includes a dependenccy on other stores
 **/
class DataStoreSignal {
  constructor(stores) {
    //TODO: Make the store also subscribe to updates
    //from the dependent stores.
    this.fetch = async () => {
      const promises = [];
      stores.forEach((storeConfig) => {
        const storeFetch = new Promise((resolve) => {
          storeConfig.store.fetchData().then(() => {
            const data = storeConfig.store.getStoreData();
            const resolveState = {
              [storeConfig.fieldName]: data,
            };
            resolve(resolveState);
          });
        });

        promises.push(storeFetch);
      });

      const data = await Promise.all(promises);
      const result = {};

      for (let i = 0; i < data.length; i++) {
        Object.assign(result, data[i]);
      }

      return result;
    };
  }
}

class ItemUpdater {
  #presentationSignals;
  #topLevelUpdateFields;

  constructor(presentationSignals) {
    this.#presentationSignals = presentationSignals;
    this.#topLevelUpdateFields = Object.keys(presentationSignals.update);
  }

  updateStoreData(storeUpdates, subscribers, prevStoreData) {
    let renderUpdates = {};

    for (let i = 0; i < this.#topLevelUpdateFields.length; i++) {
      const fieldName = this.#topLevelUpdateFields[i];
      const updateData =
        this.#presentationSignals.update[fieldName](storeUpdates);

      if (!prevStoreData || updateData !== prevStoreData[fieldName]) {
        renderUpdates[fieldName] = updateData;
      }
    }

    if (Object.keys(storeUpdates).length > 0) {
      for (let i = 0; i < subscribers.length; i++) {
        subscribers[i].updateItem(renderUpdates);
      }
    }
    return storeUpdates;
  }
}

class ListUpdater {

  #computedStateCache = new Map();
  #listFields = [];

  #prevOrdering = {};
  #presentationSignals;

  #moved = [];
  #removed = [];
  #updated = [];
  #isClear = false;
  #isReplace = false;

  constructor(presentationSignals) {
    this.#presentationSignals = presentationSignals;
    Object.keys(this.#presentationSignals).forEach((field) => {
      if (this.#presentationSignals[field]["update"]) {
        this.#listFields.push(field);
        this.#prevOrdering[field] = [];
      }
    });
  }

  updateStoreData(storeUpdates, subscribers, prevStoreData) {
    let changeData = new Map();

    for (let i = 0; i < this.#listFields.length; i++) {

      const field = this.#listFields[i];

      if (!storeUpdates[field]) {
        continue;
      }
      //Assign id value to items.
      if (this.#presentationSignals[field]?.id) {
        for (let j = 0; j < storeUpdates[field].length; j++) {
          storeUpdates[field][j].id = this.#presentationSignals[field].id(
            storeUpdates[field][j],
          );
        }
      }

      const dataItem = storeUpdates[field];
      const updatedOrdering = [];

      const newIds = new Set();
      const prevIds = new Set();

      const prevOrdering = this.#prevOrdering[field];

      this.#removed = new Set(prevOrdering);
      const maxNum = Math.max(dataItem.length, prevOrdering.length);

      let sameLocs = true;

      for (let num = 0; num < maxNum; num++) {
        if (num < dataItem.length) {
          updatedOrdering.push(dataItem[num].id);
          newIds.add(dataItem[num].id);
          this.#removed.delete(dataItem[num].id);
        }
        if (num < prevOrdering.length) {
          prevIds.add(prevOrdering[num]);
        }
        if (!dataItem[num] || dataItem[num].id !== prevOrdering[num]) {
          sameLocs = false;
        }
      }

      this.#isReplace = false;

      if (!sameLocs) {
        let added = new Set();
        if (prevIds.size === 0) {
          added = newIds;
        } else {
          added = sameLocs ? new Set() : newIds.difference(prevIds);
        }
        this.#addToSubscribers(
          added,
          subscribers,
          field,
          updatedOrdering,
          dataItem,
        );
      }

      if (!updatedOrdering || updatedOrdering.length === 0) {
        this.#isClear = true;
      }

      this.#removeFromSubscribers(
        this.#removed,
        subscribers,
        storeUpdates,
        prevStoreData,
        field,
        updatedOrdering,
      );
      this.#moveItems(updatedOrdering, subscribers, prevStoreData, field);


      if (!this.#isReplace && !this.#isClear) {
        const arrayChanges = [];

        const reactiveData = this.#presentationSignals[field]["update"];
       
        let reactiveFields;
        if(!Array.isArray(reactiveData)){
          reactiveFields = Object.keys(reactiveData);
        } else {
          reactiveFields = reactiveData;
        }

        for (let i = 0; i < storeUpdates[field].length; i++) {
          let oldStateRow = prevStoreData[field][i];

          let hasChanged = false;
          for (let j = 0; j < reactiveFields.length; j++) {
            const reactiveName = reactiveFields[j];
            const oldState = oldStateRow[reactiveName];
            const newState = storeUpdates[field][i][reactiveName];
            if (oldState !== newState) {
              hasChanged = true;
            }
          }

          if (hasChanged) {
            storeUpdates[field][i].prevStateIndex = i;
            arrayChanges.push(storeUpdates[field][i]);
          }
        }
        changeData.set(field, arrayChanges);
      } else {
        changeData.set(field,storeUpdates[field]);
      }
    }

    //Look at storeUpdates if changeData is empty
    if (changeData.size === 0 && !this.#isReplace) {
      changeData = new Map();
      Object.keys(storeUpdates).forEach((key) => {
        if (!Array.isArray(storeUpdates[key])) {
          changeData.set(key, storeUpdates[key]);
        }
      });
    }
    if (changeData.size > 0 && !this.#isReplace) {
      this.#updated = this.#generatePresentationUpdates(
        changeData,
        prevStoreData,
      );
      for (let i = 0; i < subscribers.length; i++) {
        subscribers[i].updateVisible(this.#updated);
      }
    }
    
    return storeUpdates;
  }

  #addToSubscribers(added, subscribers, field, updatedOrdering, dataItem) {
    if (added.size > 0) {
      let addFragments = [];
      let addFragment = null;

      const addSignals = this.#presentationSignals[field].update;
      const addSignalKeys = Object.keys(addSignals);
      for (let num = 0; num < updatedOrdering.length; num++) {
        const id = updatedOrdering[num];

        for (let key = 0; key < addSignalKeys.length; key++) {
          const signalField = addSignalKeys[key];
          const signal = addSignals[signalField];
          if (typeof signal === "function") {
            dataItem[num][signalField] = signal(dataItem[num]);
          }
        }
        if (added.has(id)) {
          if (addFragment === null) {
            addFragment = [];
          }
          addFragment.push(dataItem[num]);
        } else {
          if (addFragment !== null) {
            addFragments.push({
              insertBefore: dataItem[num].id,
              insertData: addFragment,
            });
            addFragment = null;
          }
        }
      }
      if (addFragment !== null) {
        addFragments.push({
          insertBefore: -1,
          insertData: addFragment,
        });
        this.#isReplace = true;
      }
      this.#prevOrdering[field] = updatedOrdering;

      for (let i = 0; i < subscribers.length; i++) {
        subscribers[i].addItems(addFragments);
      }
    }
  }

  #removeFromSubscribers(
    removed,
    subscribers,
    storeUpdates,
    prevStoreData,
    field,
    updatedOrdering,
  ) {
    if (removed.size > 0) {
      let updatedPrev = [];

      for (let a = 0; a < prevStoreData[field].length; a++) {
        const item = prevStoreData[field][a];
        if (!this.#removed.has(item.id)) {
          updatedPrev.push(item);
        }
      }

      prevStoreData[field] = updatedPrev;
      storeUpdates[field] = updatedPrev;
      this.#prevOrdering[field] = updatedOrdering;
      for (let i = 0; i < subscribers.length; i++) {
        subscribers[i].removeItems(
          this.#removed,
          this.#isReplace,
          this.#isClear,
        );
      }
    }
  }

  #moveItems(updatedOrdering, subscribers, prevStoreData, field) {
    if (
      !this.#isReplace &&
      updatedOrdering.length === this.#prevOrdering[field].length
    ) {

      const swapUpdates = [];
      for (let num = 0; num < updatedOrdering.length; num++) {
        if (updatedOrdering[num] !== this.#prevOrdering[field][num]) {
          let insertBefore = null;
          if (num < updatedOrdering.length - 1) {
            insertBefore = updatedOrdering[num + 1];
          }

          this.#moved.push({
            moveNodeId: updatedOrdering[num],
            moveBeforeId: insertBefore,
          });

          for (let a = 0; a < prevStoreData[field].length; a++) {
            const item = prevStoreData[field][a];

            if (a + 1 === updatedOrdering[num]) {
              if (!(updatedOrdering[num] === insertBefore - 1)) {
                swapUpdates.push({
                  updateIndex: num,
                  updateData: item,
                });
              }
            }
          }
        }
      }

      for (let a = 0; a < subscribers.length; a++) {
        subscribers[a].swapUpdates(this.#moved);
      }
      for (let a = swapUpdates.length - 1; a >= 0; a--) {
        const swapItem = swapUpdates[a];
        prevStoreData[field][swapItem.updateIndex] = swapItem.updateData;
      }
      this.#prevOrdering[field] = updatedOrdering;
    }
  }

  #generatePresentationUpdates(updates, prevStoreData) {

    const presentationUpdates = {};

    const keys = Object.keys(this.#presentationSignals);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      const presentationField =
        this.#presentationSignals[key]["presentationField"] || key;

      const dataToUpdate = updates[presentationField];

      if (Array.isArray(dataToUpdate)) {
        presentationUpdates[presentationField] = {};
      } else {
        presentationUpdates[presentationField] = "";
      }
    }

    const signalKeys = Object.keys(this.#presentationSignals);
    for (let i = 0; i < signalKeys.length; i++) {
      const stateField = signalKeys[i];
      const { update, presentationField } =
        this.#presentationSignals[stateField];

      if (!updates.get(stateField)) {
        continue;
      }


      if (!Array.isArray(update) && !(typeof update ==="object")) {
        let changeData;


        if (typeof update === "function") {
          //TODO: Add check if state field is array.
          changeData = update({
            prevState: prevStoreData[stateField],
            newState: updates.get(stateField),
          });
        } else {
          changeData = { param: updates.get(stateField) };
        }

        const dataToUpdate = prevStoreData[presentationField];
        if (Array.isArray(dataToUpdate)) {

          presentationUpdates[presentationField] = [];
          for (let j = 0; j < changeData.length; j++) {
            if(changeData[j].id){
              presentationUpdates[presentationField].push(changeData[j]);
            }
          }
        } else {
          presentationUpdates[presentationField] = changeData["param"];
        }
      } else {
        let changeData = [];
        for (let i = 0; i < updates.get(stateField).length; i++) {
          const updateData = updates.get(stateField)[i];
          const id = updateData.id;
          const reactiveFields =
            this.#presentationSignals[stateField]["update"];

          if (Array.isArray(reactiveFields)) {
            for (let j = 0; j < reactiveFields.length; j++) {
              changeData.push({
                id: id,
                [reactiveFields[j]]: updateData[`${reactiveFields}`],
              });
            }
          } else {
            const prevIdx = updateData.prevStateIndex;
            Object.keys(reactiveFields).forEach((fieldName) => {

               
              //if(updateData[fieldName] === 
              const newData = reactiveFields[fieldName](
                updateData 
              );
              
              const prevState = prevStoreData[stateField][prevIdx];

              const oldData = reactiveFields[fieldName](prevState);

              if(oldData !== newData){
                changeData.push({
                  id: id,
                  [fieldName]: newData 
                });
              }
            });
          }
        }
        presentationUpdates[stateField] = changeData;
      }
    }
    return presentationUpdates;
  }
}

class DefaultUpdater {
  /**
   * Update data in the store and trigger a render of components subscribed to the store.
   * @param storeUpdates Updated store data. Fields not specified in storeData will not be updated.
   */
  updateStoreData(storeUpdates, subscribers) {
    for (let i = 0; i < subscribers.length; i++) {
      subscribers[i].updateFromSubscribedStores();
    }
    return storeUpdates;
  }
}

class DataStore {
  static #storeCount = 0;
  static #storeNameMap = new Map();

  #fieldTypeMapping = {};
  #isLoading = false;
  #loadAction;

  #presentationUpdates = {};
  #presentationSignals = {};
  #prevOrdering = {};
  #requestStoreId;
  #storeData = null;
  #subscribers = [];

  #updater;

  constructor(loadAction, storeName, updater = new DefaultUpdater()) {

    this.#subscribers = [];
    this.#requestStoreId = `store-${DataStore.#storeCount}`;

    this.#updater = updater;

    sessionStorage.setItem(this.#requestStoreId, JSON.stringify({}));

    if (storeName) {
      if (DataStore.#storeNameMap.has(storeName)) {
        throw new Error(
          "Cannot create new store with duplicate name:" + storeName,
        );
      }
      DataStore.#storeNameMap.set(storeName, this);
    }

    this.#loadAction = loadAction;

    DataStore.#storeCount++;

    this.#presentationUpdates["removed"] = [];
    this.#presentationUpdates["moved"] = [];
    this.#presentationUpdates["updated"] = [];
  }

  static getStore(storeName) {
    return this.#storeNameMap.get(storeName);
  }

  static clearStores(){
    this.#storeNameMap.clear();
  }

  static createWithApiLoadSignal({
    presentationSignals,
    queryConfig,
    storeName,
  }) {
    if (presentationSignals) {
      let isArray = false;
      Object.keys(presentationSignals).forEach((key) => {
        if (key !== "update") {
          isArray = true;
        }
      });

      if (isArray) {
        return new DataStore(
          new ApiLoadAction(queryConfig),
          storeName,
          new ListUpdater(presentationSignals),
        );
      } else {
        return new DataStore(
          new DataStoreSignal(queryConfig),
          storeName,
          new ItemUpdater(presentationSignals),
        );
      }
    }
    return new DataStore(new ApiLoadAction(queryConfig), storeName);
  }

  static createWithDataStoreSignals({
    presentationSignals,
    storeSignals,
    storeName,
  }) {
    if (!storeSignals) {
      throw new Error("storeSignals is undefined");
    }

    if (presentationSignals) {
      let isArray = false;
      Object.keys(presentationSignals).forEach((key) => {
        if (key !== "update") {
          isArray = true;
        }
      });

      if (isArray) {
        return new DataStore(
          new DataStoreSignal(storeSignals),
          storeName,
          new ListUpdater(presentationSignals),
        );
      } else {
        return new DataStore(
          new DataStoreSignal(storeSignals),
          storeName,
          new ItemUpdater(presentationSignals),
        );
      }
    }
    return new DataStore(new DataStoreSignal(storeSignals), storeName);
  }

  static createWithCustomLoadSignal({loadAction, storeName,presentationSignals}) {
    
     if (presentationSignals) {
      let isArray = false;
      Object.keys(presentationSignals).forEach((key) => {
        if (key !== "update") {
          isArray = true;
        }
      });

      if (isArray) {
        return new DataStore(
          new CustomLoadSignal(loadAction),
          storeName,
          new ListUpdater(presentationSignals),
        );
      } else {
        return new DataStore(
          new CustomLoadSignal(loadAction),
          storeName,
          new ItemUpdater(presentationSignals),
        );
      }
    }
    return new DataStore(new CustomLoadSignal(loadAction), storeName);
  }

  /** * Returns store data.
   * @returns A JSON object representing store data.
   */
  getStoreData() {
    return this.#storeData;
  }

  getComponentUpdateData() {
    if (Object.keys(this.#presentationSignals).length > 0) {
      return this.#presentationUpdates;
    }

    return this.#storeData;
  }

  updateStoreData(storeUpdates) {

    const updates = this.#updater.updateStoreData(
      storeUpdates,
      this.#subscribers,
      this.#storeData || [],
    );

    if(!this.#storeData){
      this.#storeData = {};
    }

    Object.keys(updates).forEach((field)=>{
      this.#storeData[field] = updates[field];
    });
  }

  /**
   * @returns {boolean} false if the data in the store is null or undefined and is not in a loading state true otherwise.
   */
  hasLatestData() {
    return (
      this.#storeData !== null &&
      this.#storeData !== undefined &&
      !this.#isLoading
    );
  }

  getSubscribedComponents() {
    return this.#subscribers;
  }

  /**
   * Retrieves data from an external source.
   * @param params Parameters for the request.
   * @param dataStore Optional data store that will be subscribed to updates from this store.
   */
  async fetchData(params = {}, dataStore) {
    // Do not make a data request if there is an active one in progress. The active one will push data to subscribed components.
    if (!this.#isLoading) {
      this.#isLoading = true;
      const requestConfig = this.#loadAction.getRequestConfig
        ? this.#loadAction.getRequestConfig(params)
        : {};

      let response = null;
      let requestKey = null;

      // Retrieve cached response if one exists.
      if (this.#requestStoreId || this.#requestStoreId.length > 0) {
        requestKey = `${requestConfig.method ?? ""}_${requestConfig.url}_${JSON.stringify(requestConfig.body) ?? ""}`;

        const dataStr = sessionStorage.getItem(requestKey);
        if (dataStr) {
          const data = JSON.parse(dataStr);

          if (!(Object.keys(data).length === 0) && requestKey in data) {
            response = data[requestKey];
          }
        }
      }

      // Make an API call if a cached response does not exist.
      if (response === null) {
        //Replace component with loading indicator if one exists.

        if (dataStore) {
          const dataStoreSubscribedComponents =
            dataStore.getSubscribedComponents();
          for (let i = 0; i < dataStoreSubscribedComponents.length; i++) {
            dataStoreSubscribedComponents[i].lockComponent(dataStore);
          }
        }
        response = await this.#loadAction.fetch(
          params,
          this.#requestStoreId,
          requestKey,
        );
      }

      this.updateStoreData(response);

      this.#isLoading = false;

      if (dataStore) {
        const dataStoreSubscribedComponents =
          dataStore.getSubscribedComponents();
        for (let i = 0; i < dataStoreSubscribedComponents.length; i++) {
          dataStoreSubscribedComponents[i].unlockComponent(dataStore);
        }
        dataStore.updateStoreData(response);
      }
      return response;
    }
  }

  unsubscribeComponent(subscriber) {
    this.#subscribers.splice(this.#subscribers.indexOf(subscriber), 1);
  }

  subscribeComponent(subscriber) {
    let i = 0;
    while (i < this.#subscribers.length) {
      if (this.#subscribers[i] === subscriber) {
        this.#subscribers = this.#subscribers.splice(i, 1);
        break;
      }
      i++;
    }
    this.#subscribers.push(subscriber);
  }
}

class TemplateItem {
  #changeTemplateEvents;
  #changeTemplateHandlers;

  #clickTemplateEvents;
  #clickTemplateHandlers;

  #handlerDepthMap = new Map();
  #nodes = {};

  #templateNode;
  #templateRoot = null;
  #templateSignals;
  #signalMap = new Map();
  #signalList;

  static #templateFunctions = new Map();

  static addTemplateFunction(name, templateFunction) {
    TemplateItem.#templateFunctions.set(name, templateFunction);
  }

  constructor(html) {
    this.#defineComponent(html);
  }

  #initSignalMap() { 
    for (let i = 0; i < this.#templateSignals.length; i++) {
      this.#signalMap.set(
        this.#templateSignals[i].fieldName,
        this.#templateSignals[i],
      );
    }
  }

  setupChangeEventHandlers(events) {
    if (events) {
      this.#changeTemplateHandlers = events;

      (function (
        templateRoot,
        handlerDepthMap,
        changeTemplateEvents,
        changeTemplateHandlers,
      ) {
        const getItemIdForEvent = ({ eventItem, key }) => {
          const depth = handlerDepthMap.get(key);
          for (let i = 0; i < depth; i++) {
            eventItem = eventItem.parentNode;
          }
          return eventItem.data_id;
        };

        templateRoot.addEventListener("change", (e) => {
          const changeId =
            e.target.getAttribute("data-change-id") ||
            e.target.parentNode.getAttribute("data-change-id") ||
            e.target.parentNode.parentNode.getAttribute("data-change-id");
          if (changeId) {
            const key = "data-click-id_" + changeId;
            const componentId = getItemIdForEvent({
              eventItem: e.target,
              key: key,
            });

            const handlerName = changeTemplateEvents[changeId];
            changeTemplateHandlers[handlerName]({
              componentId: componentId,
            });
          }
        });
      })(
        this.#templateRoot,
        this.#handlerDepthMap,
        this.#changeTemplateEvents,
        this.#changeTemplateHandlers,
      );
    }
  }

  setupClickEventHandlers(events) {
    if (events) {
      this.#clickTemplateHandlers = events;

      (function (
        templateRoot,
        handlerDepthMap,
        clickTemplateEvents,
        clickTemplateHandlers,
      ) {
        const getItemIdForEvent = ({ eventItem, key }) => {
          const depth = handlerDepthMap.get(key);

          for (let i = 0; i < depth; i++) {
            eventItem = eventItem.parentNode;
          }
          return eventItem.data_id;
        };

        templateRoot.addEventListener("click", (e) => {
          const clickId =
            e.target.getAttribute("data-click-id") ||
            e.target.parentNode.getAttribute("data-click-id") ||
            e.target.parentNode.parentNode.getAttribute("data-click-id");

          if (clickId) {
            const key = "data-click-id_" + clickId;
            const componentId = getItemIdForEvent({
              eventItem: e.target,
              key: key,
            });

            const handlerName = clickTemplateEvents[clickId];
            clickTemplateHandlers[handlerName]({
              componentId: componentId,
            });
          }
        });
      })(
        this.#templateRoot,
        this.#handlerDepthMap,
        this.#clickTemplateEvents,
        this.#clickTemplateHandlers,
      );
    }
  }

  getSignalByFieldName(fieldName) {
    return this.#signalMap.get(fieldName);
  }

  getAllSignals() {
    return this.#templateSignals;
  }

  #evaluateConditional(templateStr) {
    const split = templateStr.split("\n");

    while (true) {
      let depth = 0;

      let firstIfPos;
      let elsePos;
      let endPos;

      for (let i = 0; i < split.length; i++) {
        if (split[i].includes("{#if")) {
          depth++;
          if (!firstIfPos) {
            firstIfPos = i;
          }
        }

        if (split[i].includes("{else}")) {
          if (depth === 1) {
            elsePos = i;
          }
        }

        if (split[i].includes("{/if}")) {
          depth--;
          if (depth === 0) {
            endPos = i;
            break;
          }
        }
      }

      if (!firstIfPos) {
        break;
      } else {
        const ifCheckName = split[firstIfPos]
          .trim()
          .split(" ")[1]
          .split("}")[0];
        const ifCheck = TemplateItem.#templateFunctions.get(ifCheckName);

        if (!ifCheck) {
          throw new Error(`No template function defined for ${ifCheckName}`);
        }

        if (ifCheck()) {
          split.splice(endPos, 1);

          if (elsePos) {
            split.splice(elsePos, endPos - elsePos);
          }
          split.splice(firstIfPos, 1);
        } else {
          split.splice(endPos, 1);
          split.splice(firstIfPos, elsePos - firstIfPos + 1);
        }
        firstIfPos = null;
        elsePos = null;
        endPos = null;
      }
    }
    return split.join("\n");
  }

  #defineComponent(templateStr) {
    templateStr = this.#evaluateConditional(templateStr);

    this.#changeTemplateEvents = [];
    this.#clickTemplateEvents = [];

    this.#templateSignals = [];

    let tokens = [];

    let startPos;
    let isHtmlTagSection;

    //Tokenize template string.
    for (let i = 0; i < templateStr.length; i++) {
      const templateChar = templateStr.charAt(i);

      if (!startPos) {
        startPos = i;
        isHtmlTagSection = templateChar === "<";
      } else if (isHtmlTagSection && templateChar === ">") {
        const token = templateStr.substring(startPos, i + 1);

        const sections = token.split("}");
        let startSection;

        const templateAttrs = [];
        for (let j = 0; j < sections.length; j++) {
          const section = sections[j];
          const equalPos = section.lastIndexOf("=");
          const spacePos = section.lastIndexOf(" ", equalPos);

          if (j === 0) {
            startSection = section.substring(0, spacePos + 1);
          }

          if (j < sections.length - 1) {
            templateAttrs.push({
              attr: section.substring(spacePos + 1, equalPos),
              fieldName: section.substring(equalPos + 3),
            });
          }
        }

        let endSection = sections[sections.length - 1];
        if (templateAttrs.length > 0) {
          if (endSection.startsWith('">')) {
            endSection = endSection.substring(0, endSection.length - 2) + ">";
          }
        } else {
          startSection = token.substring(0, token.length - 1);
          endSection = ">";
        }
        tokens.push({
          endSection: endSection,
          isHtml: true,
          startSection: startSection,
          templateAttrs: templateAttrs,
        });

        startPos = null;
        isHtmlTagSection = false;
      } else {
        if (templateChar === "<") {
          let token = templateStr
            .substring(startPos, i)
            .replaceAll("\t", "")
            .replaceAll("\n", "")
            .trim();
          if (token.trim().length > 0) {
            tokens.push({
              isHtml: false,
              token: token,
            });
          }

          startPos = null;
          i--;
        }
      }
    }

    //Determine signals and event handlers.
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.isHtml) {
        for (let j = 0; j < token.templateAttrs.length; j++) {
          let attr = token.templateAttrs[j].attr;
          if (attr.startsWith("on")) {
            if (attr === "onchange" || attr === "onChange") {
              token.templateAttrs[j].signalRef =
                `data-change-id=${this.#changeTemplateEvents.length}`;
              this.#changeTemplateEvents.push(token.templateAttrs[j].fieldName);
            }
            if (attr === "onclick" || attr === "onClick") {
              token.templateAttrs[j].signalRef =
                `data-click-id=${this.#clickTemplateEvents.length}`;
              this.#clickTemplateEvents.push(token.templateAttrs[j].fieldName);
            }
          } else {
            const signalId = this.#templateSignals.length;
            const signalRef = i > 0 ? `data-signal-id-${signalId}` : ``;

            if (attr === "innerhtml") {
              attr = "innerHTML";
            }

            const signalData = {
              attr: attr,
              fieldName: token.templateAttrs[j].fieldName,
              signalId: i > 0 ? signalId : -1,
              signalPath: signalRef,
            };

            token.templateAttrs[j].signalRef = signalRef;
            this.#templateSignals.push(signalData);
          }
        }
      } else {
        if (tokens[i].token.includes("{")) {
          const nameStart = tokens[i].token.indexOf("{");
          const nameEnd = tokens[i].token.indexOf("}");
          const fieldName = tokens[i].token.substring(nameStart + 1, nameEnd);

          const signalId = this.#templateSignals.length;
          const signalRef = i > 0 ? `data-signal-id-${signalId}` : ``;

          const signalData = {
            attr: "textcontent",
            fieldName: fieldName,
            signalId: signalId,
            signalPath: signalRef,
          };

          tokens[i - 1].templateAttrs.push({
            attr: "textcontent",
            fieldName: fieldName,
            signalRef: signalRef,
          });
          this.#templateSignals.push(signalData);
        } else {
          tokens[i].textcontent = tokens[i].token;
        }
      }
    }

    // Create new string with references to event handlers and signals.
    let templateArr = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.isHtml) {
        if (token.templateAttrs.length > 0) {
          templateArr.push(token.startSection);

          let hasText = false;
          for (let j = 0; j < token.templateAttrs.length; j++) {
            if(token.templateAttrs[j].attr==="textcontent"){
              hasText = true;
            }
            templateArr.push(" " + token.templateAttrs[j].signalRef + " ");
          }
          templateArr.push(token.endSection);
          if(hasText){
            templateArr.push(" ");
          }
        } else {
          templateArr.push(token.startSection + token.endSection);
        }
      } else {
        if (token.textcontent) {
          templateArr.push(token.textcontent);
        }
      }
    }

    let template = document.createElement("template");
    template.innerHTML = templateArr.join("");
    this.#templateNode = template.content.firstChild;
 
    const handlerAttrs = ["data-click-id", "data-change-id"];

    handlerAttrs.forEach((handlerAttr) => {
      const attrSelector = `[${handlerAttr}]`;

      this.#templateNode.querySelectorAll(attrSelector).forEach((node) => {
        const clickNum = node.attributes[handlerAttr].value;

        let depth = 0;
        while (node.parentNode.nodeName !== "#document-fragment") {
          if (node.parentNode !== null) {
            node = node.parentNode;
            depth++;
          }
        }
        const handlerDepthKey = `${handlerAttr}_${clickNum}`;
        this.#handlerDepthMap.set(handlerDepthKey, depth);
      });
    });

    for (let i = 0; i < this.#templateSignals.length; i++) {
      const signal = this.#templateSignals[i];

      // A signal id of less than one means that the data is
      // at the root.
      if (signal.signalId >= 0) {
        const selector = `[${signal.signalPath}]`;

        let childNodePath = [];
        let node = template.content.querySelector(selector);
        let searchNode = node;

        while (searchNode.parentNode.nodeName !== "#document-fragment") {
          for (let j = 0; j < searchNode.parentNode.childNodes.length; j++) {
            if (Object.is(searchNode.parentNode.childNodes[j], searchNode)) {
              childNodePath.push(`:nth-child(${j + 1})`);
            }
          }
          searchNode = searchNode.parentNode;
        }

        childNodePath = childNodePath.reverse();
        node.attributes.removeNamedItem(signal.signalPath);
        signal.signalPath = childNodePath.join(">");
      }
    }

    this.#initSignalMap();
  }

  isAttributeChar(str) {
    const code = str.charCodeAt(0);
    return (code > 64 && code < 91) || (code > 96 && code < 123);
  }

  setDataField(dataField) {
    this.dataField = dataField;
  }

  getDataField() {
    return this.dataField;
  }

  setId(id) {
    this.id = id;
  }

  setTemplateName(templateName) {
    this.templateName = templateName.toUpperCase();
  }

  setTemplateRoot(root) {
    this.#templateRoot = root;
  }

  //TOOD: Fix bug related to this.#templateNode no longer being valid.
  setSingleNode(node) {
    this.#templateNode = document.querySelector("[data-template]");
    this.#templateNode.replaceChildren(node);
  }

  appendNode(node) {
    this.#templateRoot.appendChild(node);
  }

  appendChild(fragment) {
    this.#templateRoot.appendChild(fragment);
  }

  getTemplateNode() {
    return this.#templateNode;
  }

  addNode(id, node) {
    this.#nodes[id] = node;
  }

  getNode(id) {
    return this.#nodes[id];
  }

  getFirstNode() {
    return this.#nodes[0];
  }

  removeChild(id) {
    this.#templateRoot.removeChild(this.#nodes[id]);
  }

  clearNodes() {
    this.#templateRoot.replaceChildren([]);
    setTimeout(() => {
      Object.keys(this.#nodes).forEach((id) => {
        this.#nodes[id] = null;
      });
      this.#nodes = {};
    }, 0);
  }

  setTemplateHtml(html) {
    this.#templateRoot.innerHTML = html;
  }

  getTemplateHtml() {
    return this.#templateNode.innerHTML;
  }
}

TemplateItem.addTemplateFunction("isMobile", () => {
  return window.matchMedia("(max-width: 32em)").matches;
});

class PresentationComponent extends HTMLElement {
  #changeTemplateEvents = {};
  #clickTemplateEvents = {};

  #lightDomHTML = "<p>Use light DOM or render() method to show HTML</p>";
  #loadingAnimationStart;
  #loadingIndicatorConfig;

  #selectorCache = new Map();
  #subscribedStore;

  #templateItem;

  static #templateCount = 0;
  static clickHandlerCount = 0;
  static changeHandlerCount = 0;

  /**
   * @param dataStore The data store a component is subscribed to.
   * @param loadingIndicatorConfig Configuration for the loading indicator
   **/
  constructor(dataStore) {
    super();
    this.#subscribedStore = dataStore;
  }

  startLoadingIndicator() {
    this.#lightDomHTML = this.innerHTML;
    this.innerHTML =
      this.#loadingIndicatorConfig.generateLoadingIndicatorHtml();
    this.#loadingAnimationStart = Date.now();
  }

  connectedCallback() {
    const defaultStore = this.dataset["store"];

    if (defaultStore) {
      const loadingIndicatorComponent = this.dataset["loadingIndicator"];
      if (loadingIndicatorComponent) {
        const imagePath = this.dataset["loadingImage"];
        const loadingHTML = `
            <${loadingIndicatorComponent}
						  ${imagePath ? `image-path=${imagePath}` : ``}	
            >
					  </${loadingIndicatorComponent}>`;

        this.#loadingIndicatorConfig = {
          generateLoadingIndicatorHtml: () => {
            return loadingHTML;
          },
          minTimeMs: 500,
        };
        this.startLoadingIndicator();
      }

      const dataStore = DataStore.getStore(defaultStore);
      this.#subscribedStore = DataStore.getStore(defaultStore);

      dataStore.subscribeComponent(this);
    }

    if (this.querySelector("[data-template]")) {
      this.#setupTemplate();
    }
  }

  init(initialState) {
    this.updateData(initialState);
  }

  setClickEvents(events) {
    this.#clickTemplateEvents = events;
  }

  setChangeEvents(events) {
    this.#changeTemplateEvents = events;
  }

  #generateSignal(params) {
    const { fieldName, attr, signalId, signalPath } = params.signalConfig;

    const { signalData, elementRoot } = params.updateData;

    if (signalData[fieldName] === undefined) {
      return;
    }

    let element = elementRoot;

    if (signalPath) {
      const cacheId = `${elementRoot.data_id}-${signalId}`;

      if (!this.#selectorCache.has(cacheId)) {
        element = element.querySelector(signalPath);
        this.#selectorCache.set(cacheId, element);
      } else {
        element = this.#selectorCache.get(cacheId);
      }
    }

    if (attr === "textcontent") {
      element.innerText = signalData[fieldName];
    }
    else if (attr === "innerHTML") {
      element.innerHTML = signalData[fieldName];
    } else {
      element.setAttribute(attr, `${signalData[fieldName]}`);
    }
  }

  /**
   * Unsubscribe component when it is removed from the UI.
   **/
  disconnectedCallback() {
    this.#subscribedStore.unsubscribeComponent(this);
  }

  async #completeLoadAnimation() {
    if (!this.#loadingIndicatorConfig) {
      return;
    }
    const remainTime = Date.now() - this.#loadingAnimationStart;

    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, remainTime);
    });

    await Promise.resolve(promise);
    this.innerHTML = this.#lightDomHTML;
    this.#loadingAnimationStart = null;
  }

  #setupTemplate() {
    let templateNode = this.querySelector("[data-template]");

    //Component does not have a temnplate
    if (!templateNode) {
      return;
    }

    templateNode.style.visibility = "initial";

    let templateHTML = templateNode.innerHTML;

    templateNode.innerHTML = "";
    this.#templateItem = new TemplateItem(templateHTML);

    templateNode.innerHTML = "";
    this.#templateItem.setTemplateRoot(templateNode);
    this.#templateItem.setDataField(
      templateNode?.getAttributeNode("data-template").value,
    );
    this.#templateItem.setId(
      `template-${PresentationComponent.#templateCount}`,
    );
    this.#templateItem.setTemplateName(this.nodeName);

    this.#templateItem.setupClickEventHandlers(this.#clickTemplateEvents);
    this.#templateItem.setupChangeEventHandlers(this.#changeTemplateEvents);
  }

  updateItem(state) {
    if (!this.#templateItem) {
      this.#setupTemplate();
    }
    const node = this.#templateItem.getFirstNode();
    const templateNode = this.#templateItem.getTemplateNode();

    if (!node) {
      const addNode = templateNode.cloneNode(true);
      const signals = this.#templateItem.getAllSignals();
      for(let j=0;j<signals.length;j++){

        const signalConfig = signals[j]; 
        this.#generateSignal({
          signalConfig: signalConfig,
          updateData: {
            signalData: state,
            elementRoot: addNode,
          },
        });
      }
      //TODO: Refactor. Having addNode and appendNode can
      // be confusing.
      this.#templateItem.addNode(0, addNode);
      this.#templateItem.setSingleNode(addNode);
    } else {

      const signals = this.#templateItem.getAllSignals();
      for(let i=0;i<signals.length;i++){
        const signalConfig = signals[i];
        if (state[signalConfig.fieldName]) {
          this.#generateSignal({
            signalConfig: signalConfig,
            updateData: {
              signalData: state,
              elementRoot: this.#templateItem.getNode(0),
            },
          });
        }
      }
    }
  }

  async addItems(addFragments) {
    if (this.#loadingAnimationStart) {
      await this.#completeLoadAnimation();
    }
    if (!this.#templateItem) {
      this.#setupTemplate();
    }

    const templateNode = this.#templateItem.getTemplateNode();
    const signals = this.#templateItem.getAllSignals();

    for (let j = 0; j < addFragments.length; j++) {
      const { insertBefore, insertData } = addFragments[j];
      let addFragment = document.createDocumentFragment();

      for (let k = 0; k < insertData.length; k++) {
        const addNode = templateNode.cloneNode(true);
        this.#templateItem.getAllSignals();

        addNode.data_id = insertData[k].id;
        this.#templateItem.addNode(insertData[k].id, addNode);

        for(let a=0;a<signals.length;a++){ 
          const signalConfig = signals[a];
          this.#generateSignal({
            signalConfig: signalConfig,
            updateData: {
              signalData: insertData[k],
              elementRoot: addNode,
            },
          });
        }
        addFragment.appendChild(addNode);
      }
      if (insertBefore !== -1) {
        const lastNode = this.#templateItem.getNode(insertBefore);
        lastNode.parentNode.insertBefore(addFragment, lastNode);
      } else {
        this.#templateItem.appendChild(addFragment);
      }
    }
  }

  removeItems(removeData, isReplace, isClear) {
    if (this.#loadingAnimationStart !== null) {
      this.#completeLoadAnimation();
    }
    if (isClear && !isReplace) {
      this.#templateItem.clearNodes();
    } else {
      removeData.forEach((id) => {
        this.#templateItem.removeChild(id);
      });
    }

    setTimeout(() => {
      if (isClear) {
        this.#selectorCache.clear();
      } else {
        for (const [key] of this.#selectorCache) {
          const nodeId = key.split("-")[0];
          if (removeData.has(parseInt(nodeId))) {
            this.#selectorCache.delete(key);
          }
        }
      }
    }, 0);
  }

  swapUpdates(swapUpdates) {
    for (let m = 0; m < swapUpdates.length; m++) {
      const { moveNodeId, moveBeforeId } = swapUpdates[m];
      const nodeToMove = this.#templateItem.getNode(moveNodeId);

      if (moveBeforeId !== null) {
        const moveBefore = this.#templateItem.getNode(moveBeforeId);
        moveBefore.parentNode.insertBefore(nodeToMove, moveBefore);
      } else {
        nodeToMove.parentNode.appendChild(nodeToMove);
      }
    }
  }

  async updateVisible(data) {
    if (!this.#templateItem) {
      this.#completeLoadAnimation();
      return;
    }
    if (this.#loadingAnimationStart !== null) {
      this.#completeLoadAnimation();
    }

    const updates = data[this.#templateItem.dataField] || [];
    for (let i = 0; i < updates.length; i++) {
      let attrName, attrValue, id;

      Object.keys(updates[i]).forEach((key) => {
        if (key === "id") {
          id = updates[i][key];
        } else {
          attrName = key;
          attrValue = updates[i][key];
        }
      });

      if (id) {
        const updateConfig = {
          signalConfig: this.#templateItem.getSignalByFieldName(attrName),
          updateData: {
            signalData: { [attrName]: attrValue },
            elementRoot: this.#templateItem.getNode(id),
          },
        };

        this.#generateSignal(updateConfig);
      }
    }
  }
}

class ShadowDOMComponent extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });

    this.shadowRoot;
    const template = document.createElement("template");

    template.innerHTML = this.getTemplateStyle() + `<div></div>`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.querySelector("div").innerHTML = this.render();
  }
}

class StaticComponent extends HTMLElement {
  static #clickSplitRegex = new RegExp('onclick="{', "i");
  #handlerMap = {};

  constructor() {
    super();

    const split = this.innerHTML.split(StaticComponent.#clickSplitRegex);
    for (let i = 1; i < split.length; i++) {
      const sectionSplit = split[i].split("}");
      const handlerName = sectionSplit[0];
      split[i] =
        `data-${this.nodeName}-click="${handlerName}"${sectionSplit[1]}`;
    }
    this.innerHTML = split.join("");
  }

  setClickEvents(handlerConfig) {
    const clickSelectorName = `data-${this.nodeName.toLowerCase()}-click`;

    this.querySelectorAll(`[${clickSelectorName}]`).forEach((node) => {
      const eventHandlerName = node.attributes[clickSelectorName].value;

      node.id = eventHandlerName;
      node.removeAttribute(clickSelectorName);

      this.#handlerMap[node.id] = handlerConfig[eventHandlerName];
    });

    this.addEventListener("click", (e) => {
      const clickId = e.target?.id;

      if (this.#handlerMap[clickId]) {
        this.#handlerMap[clickId](e);
      }
    });
  }
}

export { ApiLoadAction, CustomLoadSignal, DataStore, DataStoreSignal, ItemUpdater, ListUpdater, PresentationComponent, ShadowDOMComponent, StaticComponent, TemplateItem };
