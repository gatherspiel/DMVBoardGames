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
import {EventHandlerData} from "../handler/EventHandlerData.ts";
import {getUrlParameter} from "../utils/UrlParamUtils.ts";

export abstract class BaseDynamicComponent extends HTMLElement {

  #eventHandlerData:EventHandlerData;

  readonly componentId: string

  #dependenciesLoaded: boolean = true;
  #componentLoadConfig: ComponentLoadConfig;

  #formSelector: FormSelector

  #componentState: any = {};
  static instanceCount = 1;

  constructor(loadConfig: ComponentLoadConfig = {}, enablePreload?:boolean) {
    super();

    this.#componentLoadConfig = loadConfig;

    BaseDynamicComponent.instanceCount++;

    this.componentId = `${this.constructor.name}-${BaseDynamicComponent.instanceCount}`;
    this.#formSelector = new FormSelector();

    this.#eventHandlerData = new EventHandlerData(`data-${this.componentId}-element-id`);

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
    this.#eventHandlerData.resetData();
    this.generateAndSaveHTML(this.#componentState, this.#dependenciesLoaded);

    if(this.shadowRoot){
      this.#formSelector.setShadowRoot(this.shadowRoot);
    }
    this.#eventHandlerData.attachEventHandlersToDom(this.shadowRoot);
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

  addOnChangeEvent(eventConfig: any) {
    return this.#eventHandlerData.createOnChangeEvent(eventConfig, this.#formSelector, this);
  }

  addSubmitEvent(eventConfig: any) {
    return this.#eventHandlerData.createSubmitEvent(eventConfig, this.#formSelector, this);
  }

  addClickEvent(eventConfig: any, params?: any) {
    return this.#eventHandlerData.createClickEvent(eventConfig, this.#formSelector, this, params);
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
