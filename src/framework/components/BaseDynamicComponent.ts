import type { DisplayItem } from "../../ui/homepage/data/types/DisplayItem.ts";

import {
  clearSubscribers,
  createComponentStore,
  updateComponentStore,
} from "../state/data/ComponentStore.ts";
import {
  createRequestStoreWithData,
} from "../state/data/RequestStore.ts";
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
  getGlobalStateValue,
  subscribeComponentToGlobalField,
} from "../state/data/GlobalStore.ts";
import type {FormInputConfig} from "./types/FormInputConfig.ts";
import  {FormSelector} from "../FormSelector.ts";
import {EventHandlerData} from "../handler/EventHandlerData.ts";
import {generateLoadingIndicator} from "./utils/StatusIndicators.ts";
import {getUrlParameter} from "../utils/UrlParamUtils.ts";

export abstract class BaseDynamicComponent extends HTMLElement {

  #eventHandlerData:EventHandlerData;

  readonly componentStoreName: string

  #dependenciesLoaded: boolean = true;
  #componentLoadConfig: ComponentLoadConfig | undefined = undefined;

  #formSelector: FormSelector
  static instanceCount = 1;

  constructor(componentStoreName: string, loadConfig?: ComponentLoadConfig) {
    super();

    BaseDynamicComponent.instanceCount++;
    this.componentStoreName = `${componentStoreName}-${BaseDynamicComponent.instanceCount}`;

    this.#formSelector = new FormSelector();
    createComponentStore(this.componentStoreName, this, loadConfig?.defaultComponentState);

    this.#eventHandlerData = new EventHandlerData(`data-${this.componentStoreName}-element-id`);

    if (loadConfig) {
      if(loadConfig.dataFields){

        const self = this;
        loadConfig.dataFields.forEach((item:DataFieldConfig)=>{

          if(!getGlobalStateValue(item.fieldName)){
            self.#dependenciesLoaded = false;
          }

          let dataSource:BaseThunk = item.dataSource;

          //@ts-ignore
          if(window.waitingForPreload && item.preloadSource) {
            dataSource = item.preloadSource;
          }

          let storeReducer = item.dataSource.globalStateReducer
          if(!storeReducer){
            storeReducer = (a:any)=> {
              return {
                [item.fieldName]:a
              }
            }
          }
          dataSource.addGlobalStateReducer(storeReducer)

          function getRequestData() {
            let params:Record<string, string> = {};

            if(!item.urlParams){
              return params;
            }

            item.urlParams.forEach(name=>{
              params[name]=getUrlParameter(name);
            })
            return params
          }

          const requestStoreId = dataSource.getRequestStoreId()
          if(!requestStoreId){
            throw new Error("Missing request store id for data source thunk")
          }

          createRequestStoreWithData(
            requestStoreId,
            dataSource,
            getRequestData
          )
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
          subscribeComponentToGlobalField(self, fieldName);
          self.#componentLoadConfig = loadConfig;
        });
      }

      if (loadConfig[REQUEST_THUNK_REDUCERS_KEY]) {
        const component = this;

        loadConfig[REQUEST_THUNK_REDUCERS_KEY].forEach((
          config: RequestThunkReducerConfig,
        ) => {
          if (!config.thunk) {
            throw new Error(
              `Missing thunk field in ${self.componentStoreName} reducer configuration`,
            );
          }
          config.thunk.subscribeComponent(
            component.componentStoreName,
            config?.componentReducer ?? function(data:any){
              return data
            },
            config.reducerField,
          );
        });
      }
    }
  }

  updateWithStoreData(data: any) {

    if(this.#componentLoadConfig?.dataFields && this?.parentElement?.nodeName !== "PAGE-COMPONENT"){
      throw new Error("Only top level components should have data fields")
    }
    this.#eventHandlerData.resetData();

    this.generateAndSaveHTML(data, this.#dependenciesLoaded);

    if(this.shadowRoot){
      this.#formSelector.setShadowRoot(this.shadowRoot);
    }
    this.#eventHandlerData.attachEventHandlersToDom(this.shadowRoot);
  }

  updateStore(data: any) {
    updateComponentStore(this.componentStoreName, ()=>data)
  }

  generateAndSaveHTML(data: any, dependenciesLoaded:boolean) {


    if (!dependenciesLoaded) {
      this.innerHTML = generateLoadingIndicator();
    } else {
      this.#formSelector.clearFormSelectors();
      this.innerHTML = this.render(data);
    }
  }

  addShortInput(formConfig:FormInputConfig){
    return this.#formSelector.generateInputFormSelector(formConfig);
  }

  addTextInput(formConfig:FormInputConfig){
    return this.#formSelector.generateTextInputFormItem(formConfig);
  }

  addOnChangeEvent(eventConfig: any) {
    return this.#eventHandlerData.createOnChangeEvent(eventConfig, this.#formSelector, this.componentStoreName);
  }

  addSubmitEvent(eventConfig: any) {
    return this.#eventHandlerData.createSubmitEvent(eventConfig, this.#formSelector, this.componentStoreName);
  }

  addClickEvent(eventConfig: any, params?: any) {
    return this.#eventHandlerData.createClickEvent(eventConfig, this.#formSelector, this.componentStoreName, params);
  }

  disconnectedCallback(){
    clearSubscribers(this.componentStoreName);
  }

  updateFromGlobalState() {


    const componentLoadConfig = this.#componentLoadConfig;
    if(!componentLoadConfig){
      throw new Error(`Component load config is not defined for component ${this.componentStoreName}`)
    }
    const globalStateLoadConfig =
      componentLoadConfig.globalStateLoadConfig;
    if (!globalStateLoadConfig) {
      throw new Error(`Component global state config is not defined for component ${this.componentStoreName}`);
    }

      let reducer = componentLoadConfig.globalStateLoadConfig?.defaultGlobalStateReducer;
      if(!reducer){
        reducer =  (updates: Record<string, string>) => updates
      }

      let dataLoaded = true;
      this.#componentLoadConfig?.dataFields?.forEach((item:DataFieldConfig)=> {
        if(!getGlobalStateValue(item.fieldName)){
          dataLoaded = false;
        }
      });

      if(dataLoaded){
        this.#dependenciesLoaded = true;
      }

      let dataToUpdate: Record<string, string> = {};

      componentLoadConfig.globalStateLoadConfig?.globalFieldSubscriptions?.forEach(
         (fieldName) => {
          const fieldValue = getGlobalStateValue(fieldName);
          dataToUpdate[fieldName] = fieldValue;
        },
      );
      updateComponentStore(
        this.componentStoreName,
        reducer,
        dataToUpdate,
      );


  }
  abstract render(data: Record<any, DisplayItem> | any): string;
}
