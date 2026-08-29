class ApiLoadAction{

  constructor(getRequestConfig) {
    this.getRequestConfig = getRequestConfig;
  }
 
	/**
   * @param params API request parameters
   * @param cacheKey
   * @param requestKey
   */
  async fetch(params, cacheKey, requestKey){

    const queryConfig = this.getRequestConfig(params);

    if(!queryConfig.headers){
      queryConfig.headers = {};
    }

    const response = await ApiLoadAction.getResponseData(
      queryConfig,
    );

    if(cacheKey && requestKey){
      if(queryConfig?.method !== "GET"){
        for(let i = 0; i< sessionStorage.length; i++){
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
onfig:signal;

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

    let authData = null;

    const data = window.localStorage.getItem("authToken");
    if(data){
      authData = JSON.parse(data).access_token;
    }
    
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
        method: queryConfig.method ?? "GET",
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
      if(queryConfig.method !== "GET"){
       for(let i = 0; i< sessionStorage.length; i++){
          const key = sessionStorage.key(i);
          sessionStorage.setItem(key, JSON.stringify({}));
        }
      }
      return { status: 200 };
    } catch (e) {
      return {errorMessage:e.message};
    }
  }
}


class PresentationComponent {
 
  static presentationComponents = {};

  clickTemplateEvents;
  changeTemplateEvents;
  computedProps;
 
  dynamicSignals;
  templateSignals;

  templateNode;

  #defineComponent(){

    let computedState = this.defineComputedState() || {};
    let template = document.createElement("template");
    let templateStr = this.defineTemplate();

    this.templateSignals = [];
    this.dynamicSignals = [];

    this.computedProps = [];   
     
    const clickEvents = [];
    const changeEvents = [];

    const clickHandlers = {};
    const changeHandlers = {};

    const start = Date.now();
    let i = 0;

    /* TOOD: Optimize. 
     * This logic is running in O(m*n^2) time with repetitive iteration.
     * n is the number of template items and m is the length of the template string.
     * This logic should run in O(m*n) time or better.
     */
   
    const clickEventsStr = templateStr.split("onClick={{");
    if(clickEventsStr.length > 1){
      for(let i=1;i<clickEventsStr.length;i++){
        const j = clickEventsStr[i].indexOf("}}");
        
        const splitStr = clickEventsStr[i].slice(0,j);
        clickEvents.push(splitStr);
        clickEventsStr[i] = `data-click-id-${i-1}` + clickEventsStr[i].slice(j+2);
      }

      templateStr = clickEventsStr.join("");
    
    }


    const changeEventsStr = templateStr.split("onChange={{");
    if(changeEventsStr.length > 1){
      for(let i=1;i<changeEventsStr.length;i++){ 
        const j = changeEventsStr[i].indexOf("}}"); 
        
        const splitStr = changeEventsStr[i].slice(0,j);
        changeEvents.push(splitStr);
        changeEventsStr[i] = `data-change-id-${i-1}` + changeEventsStr[i].slice(j+2);
      }
      templateStr = changeEventsStr.join("");
    }



    this.changeTemplateEvents = changeEvents;
    this.clickTemplateEvents = clickEvents;

    while(true){
      let stateVarPos = templateStr.indexOf("{{");
      if(stateVarPos === -1){
        break;
      }
     
      let firstTagEnd = templateStr.indexOf(">");
      
      const endPos = templateStr.indexOf("}}");
      const signalStr = templateStr.substring(stateVarPos+2, endPos);

      let attr, fieldName;

      if(templateStr.charAt(stateVarPos-1) === "="){
        attr = "";
        for(let j = stateVarPos-2; j > 0; j--){
          const nameChar = templateStr.charAt(j);
          if(this.isAttributeChar(nameChar)){
            attr = nameChar + attr;
          } else {
            stateVarPos = j;
            break;
          }
        }
        fieldName = signalStr;
      } else {
        attr = "innerHTML"
        fieldName = signalStr;
      }

      //Set signal for HTML and text template strings.
      let isHTML = false;
      let endTagPos = -1;

      if(attr === "innerHTML"){
        for(let j = stateVarPos -1; j >= 0; j--){
          if(templateStr.charAt(j) === ">"){

            endTagPos = j;
            isHTML = true;
            break;
          } 
        }
      }
        
      let newStr=`data-signal-id-${i}`;
      if(endPos < firstTagEnd){
        newStr = "";
      }
      
      let templateFuncType = "";
      if(computedState[fieldName]){

        templateFuncType = "function";
        this.computedProps.push(
          {
            "field": fieldName,
            "func": computedState[fieldName]
          });
      }
     
      const signalData = {
        fieldName,
        attr,
        "signalId":newStr.length > 0 ? i : -1,
        isOuter: endPos < firstTagEnd
      } 

      if(!isHTML){
        if(newStr.length > 0 ){
          templateStr = templateStr.substring(0,stateVarPos) +
            newStr + templateStr.substring(endPos+2);
        } else {
          templateStr = templateStr.substring(0,stateVarPos) +
            newStr + templateStr.substring(endPos+2);
        }
      } else {
        templateStr =
          templateStr.substring(0,endTagPos) +
          " " +
          newStr +
          ">" +
          templateStr.substring(endPos+2);
      }

      this.templateSignals.push(signalData);
      if(templateFuncType === 'function'){
        this.dynamicSignals.push(signalData);
      }
      i++;
    } 

    const split = templateStr.split("\n");

    const linesToAdd = [];
    for(let i=0;i<split.length;i++){

      ///Remove empty lines because they will
      //be interpreted as empty text noddes.
      if(split[i].length > 0){
        split[i]=split[i].trim();
        //Insert space for attributes
        if(!split[i].endsWith(">")) {
          split[i]=split[i]+" ";
        }
        linesToAdd.push(split[i]);
      }
    }
    templateStr = linesToAdd.join("");

    console.log(templateStr);
    template.innerHTML = templateStr;
    
    this.templateNode = template.content.firstChild;

    //Tenplate parsing needs to be optimized for performance.
    //This is to display the overhead of the current logic.
    const parseTime = Date.now() - start;
    if(parseTime > 0){
      console.warn(`Slow template parse time of ${parseTime} miliseconds`);
    }
  }

  isAttributeChar(str){
    const code = str.charCodeAt(0);
    return (code > 64 && code < 91) || (code > 96 && code < 123)
  }
  
  static init(item){

    const obj = new item.prototype.constructor(); 
    obj.#defineComponent();

    PresentationComponent
      .presentationComponents[obj.constructor.name.toUpperCase()] = obj;
  }
  
  defineTemplate(){
    console.error("No template defined");
  } 
}

class PresentationItem {
 
  prevOrdering = [];
  prevState = {};

  prevStateLen(){
    return Object.keys(this.prevState).length;
  }

  setTemplateName(templateName){
    this.templateName = templateName.toUpperCase();
  }
  
  computePropValuesForNode(state){
    let computedPropValues = {};

    PresentationComponent
      .presentationComponents[this.templateName]
      .computedProps
      .forEach((computedConfig)=>{
        computedPropValues[computedConfig.field] = computedConfig.func(state);
      });
    return computedPropValues;
  }
  
  createTemplateNode(){
    return PresentationComponent
      .presentationComponents[this.templateName]
      .templateNode
      .cloneNode(true)
  }
      
}

class ContainerComponent extends HTMLElement {

  //TODO: Remove variables here that aren't being used. 
  #componentIsRendering = false;
  #loadingFromStores = new Set();
  #loadingStarted = 0;
  #loadingIndicatorConfig;
 
  #changeEventListeners;
  #clickEventListeners;

  #templateData = null;
  #templateContainers = null;
  #subscribedStores = [];

  componentStore = {};
  #templateLoaded = false;

  //HTML before loading animiation.
  #htmlBeforeLoading;

  prevState = {};
  static computedProps = {};
  //static prevState = {}; 
  static prevOrdering = {};

  static changeTemplateEvents = {};
  static clickTemplateEvents = {};

  static changeTemplateItemHandlers = {};
  static clickTemplateItemHandlers = {};

  static templateFunctions = {};
  static templateCount = 0;
  templateIds = [];

  static clickHandlerCount = 0;
  static changeHandlerCount = 0;

  #presentationItems = [];
	/**
	 * @param dataStoreSubscriptions - An array of data stores the component should
	 * subscribe to.
	 * indicator.
	 **/
  constructor(dataStoreSubscriptions = [], loadingIndicatorConfig) {
    super();

    if(loadingIndicatorConfig){
      this.#loadingIndicatorConfig = loadingIndicatorConfig;
    }


    //Performance optimization if component is not subscribed to data stores.
    if(dataStoreSubscriptions.length === 0) {
      return;
    }
		
    // Make sure component is subscribed to data stores.
    this.#subscribedStores = dataStoreSubscriptions;
    for(let i=0;i <this.#subscribedStores.length;i++){
      this.#subscribedStores[i].dataStore.subscribeComponent(this);
    }

    this.updateFromSubscribedStores();

    this._internals = this.attachInternals();
  }

  init(initialState){
    this.updateData(initialState);
  }
  
  #generateSignal(params){

		const {
			fieldName,
			attr,
			isOuter,
			signalId
		} = params.signalConfig
    
		const{ 
      signalData,
      elementRoot
		} = params.updateData;
    
    let updated = signalData[fieldName];  
    let element;

    if(isOuter){
      element = elementRoot;
    }
    else {    
      element = elementRoot.querySelector(`[data-signal-id-${signalId}]`);
    }
 
    if(updated === '') {
      element.removeAttribute(attr);
    }
    else {
      if (attr === "innerHTML"){
        element.textContent = updated;
      } else if(attr==="textContent"){
        element.textContent = updated;
      } else {
        element.setAttribute(attr,`${updated}`);
      }
    }
  }

  addChangeEventListeners(eventListeners){
    this.#changeEventListeners = eventListeners;
  }
  
  addClickEventListeners(eventListeners){
    this.#clickEventListeners = eventListeners;
  }
	
  /**
	 * Shows custom loading indicator if it exists. This custom loading indicator
	 * replaces UI components and disables any user events.
	 **/
  lockComponent(dataStore){

    if(!this.#loadingFromStores.has(dataStore)){
      this.#loadingFromStores.add(dataStore);
    }

		// Save the timestamp for when the loading started.
    if(this.#loadingStarted === 0){
      this.#loadingStarted = Date.now();
    }

    if(this.#loadingIndicatorConfig){ 
      
      this.#htmlBeforeLoading = this.innerHTML;
      this.innerHTML = this.#loadingIndicatorConfig.generateLoadingIndicatorHtml();
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
    if (storeUpdates) {
      this.#componentIsRendering = true;
      this.componentStore = {...this.componentStore,...storeUpdates};
      this.#generateAndSaveHTML(this.componentStore);
      this.#componentIsRendering = false;
    }
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
        }
      }
      this.updateData(
        dataToUpdate,
      );
    }
  }

  #updateSingleItemTemplate(presentationItem,state){
   
    const templateName = presentationItem.templateName;

    const prevProps = presentationItem.prevState;
		const computedPropValues = 
      presentationItem.computePropValuesForNode(state);

        let elementRoot;

    if(Object.keys(prevProps).length === 0){

      elementRoot = presentationItem.createTemplateNode();
      
      const signalsToRun = PresentationComponent.presentationComponents[templateName].templateSignals;

      signalsToRun.forEach((signalConfig)=>{
        this.#generateSignal(
          { 
            signalConfig: signalConfig,
            updateData: {
              "signalData":computedPropValues,
              "elementRoot": elementRoot,
            }
          });
      });

      const stateSlice = (state)=>{return state};
      this.#setupTemplateEventListeners(
        elementRoot,
        stateSlice,
        templateName  
      );

    } else {

      elementRoot = document.getElementById(presentationItem.id);
        
      if(!elementRoot){
        console.error("No id set for template");
      }   
    }

    const signalsToRun = PresentationComponent.presentationComponents[templateName].dynamicSignals;

		signalsToRun.forEach((signalConfig)=>{
		  if(prevProps[signalConfig.fieldName] !== computedPropValues[signalConfig.fieldName]){
			 
          this.#generateSignal(
            { 
              signalConfig: signalConfig,
              updateData: {
                "signalData":computedPropValues,
                "elementRoot": elementRoot
              }
            });	
				}
    });

    if(Object.keys(prevProps).length === 0){
      document.getElementById(presentationItem.id).replaceChildren(elementRoot);
    }
   
    presentationItem.prevState = computedPropValues;
    
  }

  #setupEventListeners(
    addNode,
    eventType,
    stateSlice,
    templateName
  ){

    const eventFieldName = `${eventType}TemplateEvents` 
    const defineName = `${eventType}Handlers`;

    let events = [];
    let templateFunctions;
    const presentationComponent = PresentationComponent.presentationComponents[templateName];

    if(presentationComponent[eventFieldName]){
      events = presentationComponent[eventFieldName];

      if(events.length > 0) { 
        templateFunctions = presentationComponent[defineName]();
      }
    }
   
    
    if(events && events.length > 0){
      for(let i=0;i<events.length;i++){

        const oldEventName = `data-${eventType}-id-${i}`;
        const elem = addNode.querySelector(`[${oldEventName}]`); 
        
        elem.removeAttribute(oldEventName);

        const newAttr = `data-${eventType}-id`;
       
        const countVar = `${eventType}HandlerCount`;
        elem.setAttribute(newAttr,ContainerComponent[countVar]);
      
        const handlerFieldName = `${eventType}TemplateItemHandlers`;
        ContainerComponent[handlerFieldName][i] = {
          "stateSlice":stateSlice,
          "templateFunction":templateFunctions[events[i]],
        }
        
        ContainerComponent[countVar]++; 
      }
    }
  }
  
  #setupTemplateEventListeners(
    addNode,
    stateSlice,
    templateName  
  ){
    this.#setupEventListeners(addNode,"click",stateSlice,templateName);
    this.#setupEventListeners(addNode,"change",stateSlice,templateName);
  }
 
  #setupTemplate(templateItem){
    
    let attrs = [];
    const attrNames = templateItem.getAttributeNames();
    const dataFieldName = templateItem.getAttribute("data-state");
    const dataTemplateName = templateItem.getAttribute("data-component");

    for(let j=0;j<attrNames.length;j++){
      const attrName = attrNames[j]; 
      const attrValue = templateItem.getAttribute(attrName);
      if(attrName.startsWith("data")||attrValue.startsWith("data")){
        templateItem.removeAttribute(attrName);
      }
      attrs.push({
        name:attrName,
        value:attrValue
      });
    }   
    
    templateItem.id = `template-${ContainerComponent.templateCount}-${dataTemplateName}`;

    this.#renderTemplates.templateIds.push({
      "id":templateItem.id,
      "templateName":dataTemplateName
    });
 
    if(!dataFieldName){
      throw new Error(`No data field defined for template ${dataTemplateName} in component ${this.nodeName}`);
    }
   
    let presentationItem = new PresentationItem(); 
    presentationItem.id = templateItem.id;
    presentationItem.setTemplateName(dataTemplateName);
    presentationItem.attributes = attrs;

    presentationItem.dataFieldName = dataFieldName;

    this.#presentationItems.push(presentationItem);

    ContainerComponent.templateCount++;

  }
  
  #renderTemplates(data,content) {

    this.#renderTemplates.templateIds = []; 
    if(!this.#presentationItems || Object.keys(this.#presentationItems).length === 0){

      const templates = content.querySelectorAll("[data-component]");
			if(!this.#presentationItems){
          this.#presentationItems = {};;
        }

      for(let i=0;i<templates.length;i++){

        this.#setupTemplate(templates[i]);  
      }

			if(this.#presentationItems.length > 0 ){
				this.#templateLoaded = true;
			}
    }
 
    for(let i = 0; i < this.#presentationItems.length;i++){

      const presentationItem = this.#presentationItems[i];
      let state = data[presentationItem.dataFieldName] || [];
     
      let isArray = false;


      const attrs = this.#presentationItems[i].attributes; 
      const attrData = [];
      for(let j=0;j<attrs.length;j++){
        if(attrs[j].value.startsWith("data")){
          const itemKey = attrs[j].value.split('.')[1];
          attrData.push({
            "name":attrs[j].name,
            "itemKey":itemKey
          });
        }
        if(attrs[j].name === "data-repeat"){
          isArray = true;
        }
      }
    
      //template is a single item.
      if(!isArray){ 
        console.log("Is single template item");
        this.#updateSingleItemTemplate(this.#presentationItems[i], data);  
        continue;
      }
    
      const prevStateLen = this.#presentationItems[i].prevStateLen();
    
      const updatedOrdering = [];
      
      const prevIds = new Set();
      const newIds = new Set();

			let sameLocs = true;
      for(let num=0;num<Math.max(state.length,prevStateLen);num++){
        if(num<state.length){
          updatedOrdering.push(state[num].id);
          newIds.add(state[num].id);
        }
        if(num < prevStateLen){
          prevIds.add(this.#presentationItems[i].prevOrdering[num]);
        }
        if(!state[num] || state[num].id !== presentationItem.prevOrdering[num]){
          sameLocs = false; 
        }
      }
   
      const presentationComponent = PresentationComponent.presentationComponents[presentationItem.templateName];

      const removed = sameLocs ? new Set() : prevIds.difference(newIds);
      const added = sameLocs ? new Set() : newIds.difference(prevIds);
      let hasReplaced = (removed.size === prevIds.size && removed.size === added.size);
      if(added.size > 0){

        const lastId = presentationItem
          .prevOrdering[prevStateLen-1];
        
				const sharedData = {};
				for(let j=0;j<attrData.length;j++){
					sharedData[attrData[j].name]= data[attrData[j].itemKey];
				}

				let addFragment = null; 
        for(let num = 0; num < updatedOrdering.length; num++){
          const updateData = updatedOrdering[num]; 
        
          if(added.has(updateData)){
            if(addFragment === null){
              addFragment = document.createDocumentFragment();
            }
           
            const itemState = state[num];        
						const computedProps = {}; 
            presentationComponent.computedProps.forEach((computedConfig)=>{
              computedProps[computedConfig.field] = computedConfig.func(itemState,sharedData);
            });
            
            const signalsToRun = presentationComponent.templateSignals;

            let addNode = presentationItem.createTemplateNode();
						const signalData =  {...computedProps,...itemState}

						signalsToRun.forEach((signal)=>{ 	
              this.#generateSignal(
								{
									signalConfig:signal,
									updateData:{
										"signalData":signalData,
										"elementRoot":addNode,
									}
								}
							);
            })
						
						addNode.id = signalData.id;
           
            presentationItem.prevState[updateData] = computedProps;

            const stateSlice = (state) =>{
              return state[this.#templateData[i].dataFieldName][num]
            }
            
            this.#setupTemplateEventListeners(
              addNode,
              stateSlice,
              presentationItem.templateName
            );
            addFragment.appendChild(addNode);
          }else {
            if(addFragment !== null){
              const curNode = this.getRootNode().getElementById(""+updateData); 
							curNode.parentNode.insertBefore(addFragment,curNode); 
              addFragment = null;
            }
          }
        }
     
        if(addFragment !== null){

          if(added.size < newIds.size - removed.size) { 
            const lastNode = this.getRootNode().getElementById(""+lastId);
            const add = document.createDocumentFragment();
            add.replaceChildren(addFragment); 
            lastNode.parentNode.appendChild(add);
          } else{
							this.getRootNode()
								.getElementById(presentationItem.id)
								.replaceChildren(addFragment);
								hasReplaced = true;
          }          
        }
        presentationItem.prevOrdering = updatedOrdering;
      }

      if(removed.size > 0) { 
				if(removed.size === prevIds.size && !hasReplaced){

          const templateElem = this.getRootNode()
              .getElementById(presentationItem.id)
          templateElem.replaceChildren([]);
          
					break; 
        }

        removed.forEach((id)=>{
          delete presentationItem.prevState[id] 
        });

        if(!hasReplaced){ 
          if(newIds.size > 0) {
            const self = this;
            removed.forEach((id)=>{ 
							const searchId = `[id="${id}"]`;
              const node = self.querySelector(searchId);
							node.parentNode.removeChild(node);
              const idx = presentationItem.prevOrdering.findIndex((elem)=>elem === id);
              presentationItem.prevOrdering.splice(idx,1); 
            });
          } }
      }

      let sameNumber = false;
      if(!hasReplaced && updatedOrdering.length === presentationItem.prevOrdering.length){
        sameNumber = true; 
        let moveNodes = [];
        for(let num=0;num<updatedOrdering.length;num++){
          if(updatedOrdering[num] !== presentationItem.prevOrdering[num]){
          
            let insertBefore = null;
            if (num < updatedOrdering.length -1){
             
              insertBefore = this.getRootNode().getElementById(
                ""+updatedOrdering[num+1]);
            }
            moveNodes.push({
              moveId:updatedOrdering[num],
              prevNode:insertBefore
            }); 
          }
        }
        
        if(moveNodes.length > 0){
          for(let mNum=moveNodes.length-1;mNum>=0;mNum--){
           
            const moveData = moveNodes[mNum];
            const nodeToMove = this.getRootNode().getElementById(
              moveData.moveId);
          
            if(moveData.prevNode !== null){
              moveData.prevNode.parentNode.insertBefore(nodeToMove,moveData.prevNode);
            } else {
              nodeToMove.parentNode.appendChild(nodeToMove);
            }
          }
        }
        presentationItem.prevOrdering = updatedOrdering;
      }
    	
      if(hasReplaced){
        break;
      }

      if(sameNumber){
				let start = Date.now();
      	
					const sharedData = {};
					for(let j=0;j<attrData.length;j++){
						sharedData[attrData[j].name]= data[attrData[j].itemKey];
					}

					for(let num=0;num<state.length;num++){
         
            const id = state[num].id;
            const itemState = state[num];        
           
            const prevProps = presentationItem.prevState[""+id]                   
						const computedPropValues = {}; 
						//Calculate computed values.
           
            const componentConfig = PresentationComponent
              .presentationComponents[presentationItem.templateName]

            componentConfig
              .computedProps
              .forEach((computedConfig)=>{
                computedPropValues[computedConfig.field] = computedConfig.func(itemState,sharedData);
            });
                  
            let updatedNode;
						
            componentConfig.dynamicSignals.forEach((signalConfig)=>{
							if(presentationItem.prevState[id][signalConfig.fieldName] !== computedPropValues[signalConfig.fieldName]){
							
								this.#generateSignal(
									{ 
										signalConfig: signalConfig,
										updateData: {
											"signalData":computedPropValues,
											"elementRoot": document.getElementById(""+id),
										}
									}
								);
							}

						});
						
						presentationItem.prevState[id] = computedPropValues;
        }
      }	
    }
  }

  /*
   * TODO: Setup to use single event with event delegation method
   *  used by templates. 
   */
  setupChangeEventListeners(){
    const rootNode = this.getRootNode();
    const selectors = (this.#changeEventListeners && Object.keys(this.#changeEventListeners)) ?? [];
    if(selectors.length > 0) {
      selectors.forEach(selector=>{
        const element = rootNode.querySelector(selector);
        if(!element){
          console.error(`Invalid selector ${selector} for click event handler`);
        }
        else {  
          element.addEventListener("change",(e)=>{
            e.preventDefault();
            this.#changeEventListeners[selector]();
          });
        }
      });
    }
  }
  
  setupClickEventListeners() {
    const rootNode = this.getRootNode(); 
    const selectors = (this.#clickEventListeners && Object.keys(this.#clickEventListeners)) || [];
    if(selectors.length > 0) {
      selectors.forEach(selector=>{
        const element = this.querySelector(selector);
        if(!element){
          throw new Error(`Invalid selector ${selector} for click event handler`);
        }
        else {  
          element.onclick = (e)=>{
            e.preventDefault();
						this.#clickEventListeners[selector]();
          };
        }
      });
    }
  }
  
  #initPresentationComponents(data) {
    this.#renderTemplates(data,this.getRootNode());

      this.#renderTemplates.templateIds.forEach((templateId)=>{
    
        const changeHandlers = ContainerComponent.changeTemplateEvents[templateId.templateName.toUpperCase()]

        if(PresentationComponent.presentationComponents[templateId.templateName.toUpperCase()].changeTemplateEvents){
          this.getRootNode().getElementById(templateId.id)
            .addEventListener("change",(e)=>{

              const id = e.target.getAttribute("data-change-id") || 
                         e.target.parentNode.getAttribute("data-change-id") ||  
                         e.target.parentNode.parentNode.getAttribute("data-change-id")

              if(id !== null){
                ContainerComponent.changeTemplateItemHandlers[id].templateFunction({
                  "event":e,
                  "componentAttrs": this.attributes,
                  "state":ContainerComponent.changeTemplateItemHandlers[id].stateSlice(this.componentStore)
                })
              }
          });
        }
        
        if(PresentationComponent.presentationComponents[templateId.templateName.toUpperCase()].clickTemplateEvents){
          this.getRootNode().getElementById(templateId.id)
            .addEventListener("click",(e)=>{
              const id = e.target.getAttribute("data-click-id")
                      || e.target.parentNode.getAttribute("data-click-id") 
                      || e.target.parentNode.parentNode.getAttribute("data-click-id") 


              if(id !== null) {

                e.preventDefault(); 
                ContainerComponent.clickTemplateItemHandlers[id].templateFunction({
                  "event":e,
                  "componentAttrs":this.attributes,
                  "state":ContainerComponent.clickTemplateItemHandlers[id].stateSlice(this.componentStore) 
                })
              }
          });
        }
          
      });
      this.setupClickEventListeners();  
      this.setupChangeEventListeners();
  }
	
  #generateAndSaveHTML(data) {


    //Don't re-render static HTML if templates are being used.
    if(!this.#templateLoaded){
      //const template = document.createElement("template");
      if(this.#loadingStarted > 0){

        const current = Date.now();
        const loadTime = current - this.#loadingStarted;

        this.#loadingStarted = 0;
        
        //Handle case where loading indicator is configured to stay visible for a
        //minimum amount of time.
        if(this.#loadingIndicatorConfig?.minTimeMs){
          const remainingTime = this.#loadingIndicatorConfig.minTimeMs - loadTime;

          const self = this;
          if(remainingTime > 0){
            setTimeout(()=>{
              //template.innerHTML = this.render(data);
							this.innerHTML = this.render(data);
            },remainingTime);
          } else {
            this.innerHTML = this.render(data);
          }
        } else {
          this.innerHTML = this.render(data);
        }
      }
      else {
        this.innerHTML = this.render(data);
      }

      this.#initPresentationComponents(data);
		} else {

      if(this.#htmlBeforeLoading){
        this.innerHTML = this.#htmlBeforeLoading;  
      }
			this.#renderTemplates(data,this);
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

/**
 * Class to define a custom data store load action with direct control over any async calls that are made.
 * It is intended for use when additional processing needs to be done after an async call, or if a store needs
 * to combine data from multiple sources.
 */
class CustomLoadAction {
  constructor(loadFunction) {
    this.fetch = async (params) => {
      return await loadFunction(params);
    };
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
    this.#requestStoreId = `store-${DataStore.#storeCount}`;
    
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
    this.#storeData = {...this.#storeData,...storeUpdates};
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

    // Do not make a data request if there is an active one in progress. The active one will push data to subscribed components.
    if(!this.#isLoading) {
      this.#isLoading = true;

      const requestConfig = this.#loadAction.getRequestConfig ? this.#loadAction.getRequestConfig(params) : {};

      let response = null;
      let requestKey = null;
      
      // Retrieve cached response if one exists.
			if(this.#requestStoreId || this.#requestStoreId.length > 0){
        requestKey = `${requestConfig.method ?? ''}_${requestConfig.url}_${JSON.stringify(requestConfig.body) ?? ''}`;
      
        const dataStr = sessionStorage.getItem(requestKey);
        if(dataStr){
          const data = JSON.parse(dataStr);

          if(!(Object.keys(data).length === 0) && requestData in data){
            response = data[requestData];
          }
        }
      }

      // Make an API call if a cached response does not exist.
      if(response === null) {
        //Replace component with loading indicator if one exists.
        for (let i = 0; i < this.#componentSubscriptions.length; i++) {
          this.#componentSubscriptions[i].lockComponent(this);
        }
        if (dataStore) {
          const dataStoreSubscribedComponents = dataStore.getSubscribedComponents();
          for (let i = 0; i < dataStoreSubscribedComponents.length; i++) {
            dataStoreSubscribedComponents[i].lockComponent(dataStore);
          }
        }
        response = await this.#loadAction.fetch(params, this.#requestStoreId,requestKey); 
      } 
      
	    this.#storeData = response;
      this.#isLoading = false;

      for(let i = 0; i < this.#componentSubscriptions.length; i++){
        this.#componentSubscriptions[i].unlockComponent(this);
        this.#componentSubscriptions[i].updateFromSubscribedStores();
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
    this.#componentSubscriptions.splice(this.#componentSubscriptions.indexOf(component), 1);
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

export { ApiLoadAction, ContainerComponent, ShadowDOMComponent, CustomLoadAction, DataStore, PresentationComponent};
