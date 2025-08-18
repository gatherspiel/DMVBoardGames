import type { DisplayItem } from "../../ui/homepage/data/types/DisplayItem.ts";


import {
  type ComponentLoadConfig, type DataFieldConfig,
  GLOBAL_FIELD_SUBSCRIPTIONS_KEY,
  GLOBAL_STATE_LOAD_CONFIG_KEY,
  REQUEST_THUNK_REDUCERS_KEY,
  type RequestThunkReducerConfig,
  validComponentLoadConfigFields,
} from "./types/ComponentLoadConfig.ts";
import type {BaseThunk} from "../state/update/BaseThunk.ts";
import {
  getGlobalStateValueIfPresent,
  subscribeToGlobalField,
} from "../state/data/GlobalStore.ts";
import type {FormInputConfig} from "./types/FormInputConfig.ts";
import  {FormSelector} from "../FormSelector.ts";
import {getUrlParameter} from "../utils/UrlParamUtils.ts";
import type {EventHandlerThunkConfig} from "../state/update/event/types/EventHandlerThunkConfig.ts";
import {BaseDispatcher} from "../state/update/BaseDispatcher.ts";
import {EventHandlerAction} from "../state/update/event/EventHandlerAction.ts";
import {EventThunk} from "../state/update/event/EventThunk.ts";
import type {EventValidationResult} from "../state/update/event/types/EventValidationResult.ts";

type EventConfig = {
  eventType: string;
  eventFunction: (e: Event) => any;
};

export abstract class BaseDynamicComponent extends HTMLElement {


  readonly componentId: string

  #dependenciesLoaded: boolean = true;
  #componentLoadConfig: ComponentLoadConfig;

  #formSelector: FormSelector

  #componentState: any = {};
  static instanceCount = 1;

  #eventHandlerConfig:Record<string, EventConfig>;
  #eventTagIdCount = 0;
  #elementIdTag:string;

  constructor(loadConfig: ComponentLoadConfig = {}, enablePreload?:boolean) {
    super();

    this.#eventHandlerConfig = {};
    this.#componentLoadConfig = loadConfig;

    BaseDynamicComponent.instanceCount++;

    this.componentId = `${this.constructor.name}-${BaseDynamicComponent.instanceCount}`;
    this.#formSelector = new FormSelector();

    this.#elementIdTag = `data-${this.componentId}-element-id`;


    if(loadConfig.dataFields){

      const self = this;
      loadConfig.dataFields.forEach((item:DataFieldConfig)=>{

        if(!getGlobalStateValueIfPresent(item.fieldName)){
          self.#dependenciesLoaded = false;
        }

        let dataSource:BaseThunk = (enablePreload && item.preloadSource) ? item.preloadSource : item.dataSource;

        let storeReducer = dataSource.globalStateReducer
        if(!storeReducer){
          storeReducer = (a:any)=> {
            return {
              [item.fieldName]:a
            }
          }
        }

        dataSource.addGlobalStateReducer(storeReducer)

        let params:Record<string, string> = {};

        if(item.urlParams){
          item.urlParams.forEach(name=>{
            params[name]=getUrlParameter(name);
          })
        }

        dataSource.retrieveData(params);
      })
    }
    const self = this;

    Object.keys(loadConfig).forEach((configField: any) => {
      if (!validComponentLoadConfigFields.includes(configField)) {
        throw new Error(
          `Invalid component load config field ${configField} for ${self.localName}. Valid fields are
          ${validComponentLoadConfigFields}`,
        );
      }
    });

    const globalStateLoadConfig = loadConfig[GLOBAL_STATE_LOAD_CONFIG_KEY];

    if (globalStateLoadConfig?.[GLOBAL_FIELD_SUBSCRIPTIONS_KEY]) {

      globalStateLoadConfig[GLOBAL_FIELD_SUBSCRIPTIONS_KEY].forEach(
        (fieldName: string) => {
        subscribeToGlobalField(self, fieldName);
      });
    }

    if (loadConfig[REQUEST_THUNK_REDUCERS_KEY]) {

      loadConfig[REQUEST_THUNK_REDUCERS_KEY].forEach((
        config: RequestThunkReducerConfig,
      ) => {
        if (!config.thunk) {
          throw new Error(
            `Missing thunk field in ${self.componentId} reducer configuration`,
          );
        }
        config.thunk.subscribeComponent(
          this,
          config?.componentReducer ?? function(data:any){
            return data
          },
          config.reducerField,
        );
      });
    }

  }

  resetData(){
    this.#eventHandlerConfig = {};
    this.#eventTagIdCount = 0;
  }

  attachEventHandlersToDom(shadowRoot?:any){
    const eventHandlers = this.#eventHandlerConfig;
    const elementIdTag = this.#elementIdTag;

    const addEventHandler = function (item: Element) {
      const id = item.getAttribute(elementIdTag) ?? "";
      const eventConfig = eventHandlers[id];
      item.addEventListener(eventConfig.eventType, eventConfig.eventFunction);
    };

    if (shadowRoot) {
      shadowRoot?.querySelectorAll(`[${elementIdTag}]`).forEach(
        (item:any) => {
          addEventHandler(item);
        });
    } else {

      document.querySelectorAll(`[${elementIdTag}]`).forEach( (
        item: Element,
      ) => {
        addEventHandler(item);
      });
    }
  }

  updateWithCustomReducer(data: any,
                          updateFunction = (data:any)=>data) {
    if (!data) {
      data = this.#componentState
    }

    const updatedData = updateFunction(data);
    if (!updatedData) {
      throw new Error(
        `Update function for  must return a JSON object`,
      );
    }

    this.#componentState = {...this.#componentState,...updatedData};
    this.resetData();
    this.generateAndSaveHTML(this.#componentState, this.#dependenciesLoaded);

    if(this.shadowRoot){
      this.#formSelector.setShadowRoot(this.shadowRoot);
    }
    this.attachEventHandlersToDom(this.shadowRoot);
  }


  getComponentStore(){
    return this.#componentState;
  }

  hasUserEditPermissions(){
    return this.#componentState?.permissions?.userCanEdit;
  }

  // @ts-ignore
  generateAndSaveHTML(data: any, dependenciesLoaded:boolean) {
    this.#formSelector.clearFormSelectors();
    this.innerHTML = this.render(data);
  }

  addShortInput(formConfig:FormInputConfig){
    return this.#formSelector.generateInputFormSelector(formConfig);
  }

  addTextInput(formConfig:FormInputConfig){
    return this.#formSelector.generateTextInputFormItem(formConfig);
  }


  createEvent(eventConfig: any, eventType:string, params?:any){
    const eventHandler = this.createHandler(
      eventConfig,
      this.#formSelector,
      this,
      params
    );
    let eventId = `${this.#elementIdTag}=${this.#eventTagIdCount}`;

    this.#eventHandlerConfig[this.#eventTagIdCount] = {
      eventType: eventType,
      eventFunction: eventHandler,
    };
    this.#eventTagIdCount++;
    return eventId;
  }

  createHandler(
    eventConfig: EventHandlerThunkConfig,
    formSelector: FormSelector,
    component: BaseDynamicComponent,
    params?: any
  ) {


    const dispatchers: BaseDispatcher[] = [];
    let componentStoreUpdate = new BaseDispatcher(
      component,
      eventConfig.componentReducer,
    );
    dispatchers.push(componentStoreUpdate);

    const apiRequestThunk = eventConfig.apiRequestThunk;
    if(apiRequestThunk){
      const storeUpdate = new BaseDispatcher(apiRequestThunk, (a: any): any => {
        return a;
      });
      dispatchers.push(storeUpdate);
    }

    const request: EventHandlerAction = new EventHandlerAction(
      eventConfig.eventHandler,
      component,
      formSelector,
      params
    );

    const eventUpdater: EventThunk = new EventThunk(request, dispatchers);

    const handler = function (e: Event) {

      /**
       * TODO for refactoring
       *
       * -Move EventHandlerAction.retrieveData logic here.
       * -Update API thunk and component state directly.
       * -Delete EventHandlerAction.ts
       * -Delete EventThunk logic here and then try and delete EventThunk class.
       * -Delete logic related to dispatchers
       */
      e.preventDefault();

      const validatorFunction = eventConfig.validator;
      if (validatorFunction) {
        const validator = function (): EventValidationResult {
          const componentData = component.getComponentStore();
          return validatorFunction(formSelector, componentData);
        };

        eventUpdater.processEvent(e, validator).then((result: any) => {
          if (result?.errorMessage) {
            componentStoreUpdate.updateStore(result);
          }
        });
      } else {
        eventUpdater.processEvent(e);
      }
    };
    return handler;
  }

  updateFromGlobalState(globalStateData:any) {


    const globalStateLoadConfig =
      this.#componentLoadConfig.globalStateLoadConfig;
    if (!globalStateLoadConfig) {
      throw new Error(`Component global state config is not defined for component ${this.componentId}`);
    }

    let reducer =
      this.#componentLoadConfig.globalStateLoadConfig?.defaultGlobalStateReducer ??
      ((updates: Record<string, string>) => updates)


    let dataLoaded = true;


    this.#componentLoadConfig?.dataFields?.forEach((item:DataFieldConfig)=> {
      if(!(globalStateData[item.fieldName])){
        dataLoaded = false;
      }
    });

    if(dataLoaded){
      this.#dependenciesLoaded = true;
    }

    let dataToUpdate: Record<string, string> = {};

    this.#componentLoadConfig.globalStateLoadConfig?.globalFieldSubscriptions?.forEach(
       (fieldName) => {
        dataToUpdate[fieldName] = globalStateData[fieldName];
      },
    );

    if(this.#dependenciesLoaded){
      this.updateWithCustomReducer(
        dataToUpdate,
        reducer
      );
    }


  }
  abstract render(data: Record<any, DisplayItem> | any): string;
}
