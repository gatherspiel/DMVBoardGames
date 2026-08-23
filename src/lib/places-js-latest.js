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
  static init(item){
    console.log(item);
    console.log("Setting up");
  }
  
  defineTemplate(){
    console.error("No template defined");
  }
}
class ContainerComponent extends HTMLElement {

  #attachedEventsToShadowRoot = false;
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

  static computedProps = {};
  static templates = {};
  static templateSignals = {};
  static dynamicSignals = {};
  static prevState = {}; 
  static prevOrdering = {};

  static changeTemplateEvents = {};
  static clickTemplateEvents = {};

  static changeTemplateItemHandlers = {};
  static clickTemplateItemHandlers = {};

  static templateFunctions = {};
  static templateCount = 0;
  templateIds = [];

  static eventHandlerCount = 0;

  static #isAttributeChar(str){
    const code = str.charCodeAt(0);
    return (code > 64 && code < 91) || (code > 96 && code < 123)
  }

  static definePresentationComponent(templateFunc, templateName){

    let template = document.createElement("template");
    let templateStr = templateFunc();

    let signals = [];
    let dynamicSignals = [];

    ContainerComponent.computedProps[templateName.toUpperCase()] = [];   
     
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
    const changeEventsStr = templateStr.split("onChange={{");
    if(clickEventsStr.length > 1){
      for(let i=1;i<clickEventsStr.length;i++){
        const j = clickEventsStr[i].indexOf("}}");
        
        const splitStr = clickEventsStr[i].slice(0,j);
        clickEvents.push(splitStr);
        clickEventsStr[i] = `data-click-id-${i-1}` + clickEventsStr[i].slice(j+2);
      }

      templateStr = clickEventsStr.join("");
    }

    if(changeEventsStr.length > 1){
      for(let i=1;i<changeEventsStr.length;i++){
        
        const j = changeEventsStr[i].indexOf("}}"); 
        const splitStr = changeEventsStr[i].slice(0,j);
        changeEvents.push(splitStr);

        changeEventsStr[i] = `data-change-id-${i-1}` + changeEventsStr[i].slice(j+2);
      }

      templateStr = changeEventsStr.join("");
    }


    ContainerComponent.changeTemplateEvents[templateName.toUpperCase()] = changeEvents;
    ContainerComponent.clickTemplateEvents[templateName.toUpperCase()] = clickEvents;

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
          if(ContainerComponent.#isAttributeChar(nameChar)){
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
      const templateFuncType = typeof templateFunc[fieldName];
      if(templateFuncType === 'function'){
        ContainerComponent.computedProps[templateName.toUpperCase()].push(
          {
            "field": fieldName,
            "func": templateFunc[fieldName]
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
          templateStr = templateStr.substring(0,stateVarPos-1) +
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

      signals.push(signalData);
      if(templateFuncType === 'function'){
        dynamicSignals.push(signalData);
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

    ContainerComponent.templateSignals[templateName.toUpperCase()] = signals;
    ContainerComponent.dynamicSignals[templateName.toUpperCase()] = dynamicSignals;

    template.innerHTML = templateStr;
    ContainerComponent.templateFunctions[templateName.toUpperCase()] = templateFunc;
    
    
    ContainerComponent.templates[templateName.toUpperCase()] = template.content.firstChild;
    ContainerComponent.prevState[templateName.toUpperCase()]={};
    ContainerComponent.prevOrdering[templateName.toUpperCase()]=[];
   
    //Tenplate parsing needs to be optimized for performance.
    //This is to display the overhead of the current logic.
    const parseTime = Date.now() - start;
    if(parseTime > 0){
      console.warn(`Slow template parse time of ${parseTime} miliseconds`);
    }
  }

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
        element.innerHTML = updated;
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

	#runDirectives(data) {
		this.#templateData = null;
	}

  #updateSingleItemTemplate(templateName,templateData,state){
   
    let id = templateData.dataTemplateName;

    const prevProps = ContainerComponent.prevState[templateName]
		const computedPropValues = {}; 

    //Calculate computed values.
    ContainerComponent.computedProps[templateName].forEach((computedConfig)=>{
      computedPropValues[computedConfig.field] = computedConfig.func(state);
    });

    let elementRoot;

    if(Object.keys(prevProps).length === 0){

      elementRoot = ContainerComponent.templates[templateName].cloneNode(true);
      
      const signalsToRun = ContainerComponent.templateSignals[templateName];
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

      const templateId = templateData.dataTemplateName;
      elementRoot = document.getElementById(templateId);
        
      if(!elementRoot){
        console.error("No id set for template");
      }   
    }

    const signalsToRun = ContainerComponent.dynamicSignals[templateName];
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
      document.getElementById(id).replaceChildren(elementRoot);
    }
   
    ContainerComponent.prevState[templateName] = computedPropValues;
    
  }

  #setupEventListeners(
    addNode,
    eventType,
    stateSlice,
    templateName
  ){

    const eventFieldName = `${eventType}TemplateEvents` 
    const events = ContainerComponent[eventFieldName][templateName];  
    const templateFunction = ContainerComponent.templateFunctions[templateName.toUpperCase()];

    if(this.nodeName === "SEARCH-COMPONENT"){
    }

    if(events && events.length > 0){
      for(let i=0;i<events.length;i++){

        const oldEventName = `data-${eventType}-id-${i}`;
        const elem = addNode.querySelector(`[${oldEventName}]`); 
        
        elem.removeAttribute(oldEventName);

        const newAttr = `data-${eventType}-id`;
        
        elem.setAttribute(newAttr,ContainerComponent.eventHandlerCount);
        
        const handlerFieldName = `${eventType}TemplateItemHandlers`;
       
        console.log(handlerFieldName);
        ContainerComponent[handlerFieldName][i] = {
          "stateSlice":stateSlice,
          "templateFunction":templateFunction[events[i]],
        }
        
        ContainerComponent.eventHandlerCount++; 
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
  
  #renderTemplates(data,content) {

    this.#renderTemplates.templateIds = []; 
    if(!this.#templateData || this.#templateData.length === 0){

      const templates = content.querySelectorAll("[data-presentation-component]");
			if(!this.#templateData){
          this.#templateData = [];
        }

      for(let i=0;i<templates.length;i++){

        let attrs = [];
        const attrNames = templates[i].getAttributeNames();
        const dataFieldName = templates[i].getAttribute("data-array");
        const dataTemplateName = templates[i].getAttribute("data-presentation-component");

        for(let j=0;j<attrNames.length;j++){
          const attrName = attrNames[j]; 
          const attrValue = templates[i].getAttribute(attrName);
          if(attrName.startsWith("data")||attrValue.startsWith("data")){
            templates[i].removeAttribute(attrName);
          }
          attrs.push({
            name:attrName,
            value:attrValue
          });
        }   
				
        templates[i].id = `template-${ContainerComponent.templateCount}-${dataTemplateName}`;

        this.#renderTemplates.templateIds.push({
          "id":templates[i].id,
          "templateName":dataTemplateName
        });
        
        this.#templateData.push({
          attributes:attrs,
          dataFieldName:dataFieldName,
          dataTemplateName: templates[i].id
        });
        ContainerComponent.templateCount++;
      }

			if(templates.length > 0 ){
				this.#templateLoaded = true;
			}
    }
 
    for(let i = 0; i < this.#templateData.length;i++){
			const templateName = 
        this.#templateData[i]
          .dataTemplateName
          .split("-")[2]
          .toUpperCase();  
     
      let isArray = false;
      const state = data[this.#templateData[i].dataFieldName] || []; 
    
      const attrs = this.#templateData[i].attributes; 
      const attrData = [];
      for(let j=0;j<attrs.length;j++){
        if(attrs[j].name !== "data-array"){
          if(attrs[j].value.startsWith("data")){
            const itemKey = attrs[j].value.split('.')[1];
            attrData.push({
              "name":attrs[j].name,
              "itemKey":itemKey
            });
          }
        } else {
          isArray = true;
        }
      }

      //template is a single item.
      if(!isArray){ 
        this.#updateSingleItemTemplate(templateName,this.#templateData[i], data);  
        continue;
      }
      
      const prevStateLen = Object.keys(ContainerComponent.prevState[templateName]).length;
    
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
          prevIds.add(ContainerComponent.prevOrdering[templateName][num]);
        }
        if(!state[num] || state[num].id !== ContainerComponent.prevOrdering[templateName][num]){
          sameLocs = false; 
        }
      }
    
      const removed = sameLocs ? new Set() : prevIds.difference(newIds);
      const added = sameLocs ? new Set() : newIds.difference(prevIds);
      let hasReplaced = (removed.size === prevIds.size);
      if(added.size > 0){

        const lastId = ContainerComponent.prevOrdering[templateName][prevStateLen-1];
        
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
            ContainerComponent.computedProps[templateName].forEach((computedConfig)=>{
              computedProps[computedConfig.field] = computedConfig.func(itemState,sharedData);
            });
            
            const signalsToRun = ContainerComponent.templateSignals[templateName];

            let addNode = ContainerComponent.templates[templateName].cloneNode(true);
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
           
            ContainerComponent.prevState[templateName][updateData] = computedProps;


            data[this.#templateData[i].dataFieldName] 
            
            const stateSlice = (state) =>{
              return state[this.#templateData[i].dataFieldName][num]
            }
            
            this.#setupTemplateEventListeners(
              addNode,
              stateSlice,
              templateName  
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
								.getElementById(this.#templateData[i].dataTemplateName)
								.replaceChildren(addFragment);
								hasReplaced = true;
          }          
        }
        ContainerComponent.prevOrdering[templateName] = updatedOrdering;
      }

      
      if(removed.size > 0) { 
				if(removed.size === prevIds.size && !hasReplaced){
						const templateElem = this.getRootNode()
                .getElementById(this.#templateData[i].dataTemplateName)
						templateElem.replaceChildren([]);
            ContainerComponent.prevState[templateName] = {};

					const templateFunc = ContainerComponent.templateFunctions[templateName];	
					break; 
        }

        removed.forEach((id)=>{
            delete ContainerComponent.prevState[templateName][id] 
        });

        if(!hasReplaced){ 
          if(newIds.size > 0) {
            const self = this;
            removed.forEach((id)=>{ 
							const searchId = `[id="${id}"]`;
              const node = self.querySelector(searchId);
							node.parentNode.removeChild(node);
              const idx = ContainerComponent.prevOrdering[templateName].findIndex((elem)=>elem === id);
              ContainerComponent.prevOrdering[templateName].splice(idx,1); 
            });
          } }
      }

      let sameNumber = false;
      if(!hasReplaced && updatedOrdering.length === ContainerComponent.prevOrdering[templateName].length){
        sameNumber = true; 
        let moveNodes = [];
        for(let num=0;num<updatedOrdering.length;num++){
          if(updatedOrdering[num] !== ContainerComponent.prevOrdering[templateName][num]){
          
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
        ContainerComponent.prevOrdering[templateName] = updatedOrdering; 
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
           
            const prevProps = ContainerComponent.prevState[templateName][""+id]                   
						const computedPropValues = {}; 
						//Calculate computed values.
            ContainerComponent.computedProps[templateName].forEach((computedConfig)=>{
              computedPropValues[computedConfig.field] = computedConfig.func(itemState, sharedData);
            });

                  
            let updatedNode;
            const signalsToRun = ContainerComponent.dynamicSignals[templateName];
						signalsToRun.forEach((signalConfig)=>{
							if(ContainerComponent.prevState[templateName][id][signalConfig.fieldName] !== computedPropValues[signalConfig.fieldName]){
							
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
						
						ContainerComponent.prevState[templateName][id] = computedPropValues;
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
						requestAnimationFrame(()=>{
							clickEventListeners[selector]();
						});
          };
        }
      });
    }
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
              template.innerHTML = this.render(data);
							this.innerHTML = template.innerHTML;
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

			this.runDirectives(this.getRootNode(),data);     	
			this.#renderTemplates(data,this.getRootNode());

      this.#renderTemplates.templateIds.forEach((templateId)=>{
    
        const changeHandlers = ContainerComponent.changeTemplateEvents[templateId.templateName.toUpperCase()]

        if(changeHandlers){
          this.getRootNode().getElementById(templateId.id)
            .addEventListener("change",(e)=>{
              
              const id = e.target.getAttribute("data-change-id");
            
              this.changeEventHandlers[id].templateFunction(
                e,
                this,
                ContainerComponent.changeTemplateItemHandlers[id].stateSlice(this.componentStore)
              )
          });
        }
       
        if(ContainerComponent.clickTemplateEvents[templateId.templateName.toUpperCase()]){
          console.log("Adding events?");
          this.getRootNode().getElementById(templateId.id)
            .addEventListener("click",(e)=>{
              e.preventDefault(); 
              const id = e.target.getAttribute("data-click-id");
              console.log("Id:"+id);
              ContainerComponent.clickTemplateItemHandlers[id].templateFunction(
                e,
                this,
                ContainerComponent.clickTemplateItemHandlers[id].stateSlice(this.componentStore)
  
              )
          });
        }
          
      });
      this.setupClickEventListeners();  
      this.setupChangeEventListeners();
    } else {
			this.runDirectives(this.getRootNode(),data);	
			this.#renderTemplates(data,this);
    }		
  }
  
	runDirectives(root, data){

		const showIfNodes = root.querySelectorAll("[data-show-if]");

		const self = this;
		showIfNodes.forEach((node)=>{
			const func = node.getAttribute("data-show-if");

			if(self[func]){

				const config = self[func](data);
			
				const showIf = config.showIf(data);	
				if(!showIf){
					self[func].showHTML = node.innerHTML;

          if(this.#templateData){
            this.#templateData.forEach((item)=>{
              //Only clear template state inside conditional
              if(!node.querySelector(`#${item.dataTemplateName}`)){
                const prevStateKey = item.dataTemplateName.split("-")[2];	

                if(self[func].showIf !== false) {
                  ContainerComponent.prevState[prevStateKey.toUpperCase()] = {};
                } 
              }
            });
          }

          if(self[func].showIf !== false){
					  node.innerHTML = config.fallback;
          }
				} else {
					if(self[func].showIf !== true){
						node.innerHTML = config.isVisible;
						this.#templateData = null;	
					}
				}
				self[func].showIf = showIf;
			}
		});
	}
}

class ShadowDomComponent extends HTMLElement {
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

export { ApiLoadAction, ContainerComponent, ShadowDomComponent, CustomLoadAction, DataStore, PresentationComponent};
