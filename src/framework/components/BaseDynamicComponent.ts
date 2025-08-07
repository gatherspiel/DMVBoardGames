import type { DisplayItem } from "../../ui/homepage/data/types/DisplayItem.ts";

import {
  clearSubscribers,
  createComponentStore,
  updateComponentStore,
} from "../state/data/ComponentStore.ts";
import {
  initRequestStoresOnLoad,
} from "../state/data/RequestStore.ts";
import {
  type ComponentLoadConfig,
  type RequestThunkReducerConfig,
  validComponentLoadConfigFields,
} from "./types/ComponentLoadConfig.ts";
import type {BaseThunk, LoadStatus} from "../state/update/BaseThunk.ts";
import {
  getGlobalStateValue,
  subscribeComponentToGlobalField,
} from "../state/data/GlobalStore.ts";
import type {FormInputConfig} from "./types/FormInputConfig.ts";
import  {FormSelector} from "../FormSelector.ts";
import {EventHandlerData} from "../handler/EventHandlerData.ts";
import {generateLoadingIndicator} from "./utils/StatusIndicators.ts";

export abstract class BaseDynamicComponent extends HTMLElement {

  eventHandlerData:EventHandlerData;

  componentStoreName: string
  requestStoreReducer?: BaseThunk;

  dependenciesLoaded: boolean = true;
  componentLoadConfig: ComponentLoadConfig | undefined = undefined;

  formSelector: FormSelector
  static instanceCount = 1;

  constructor(componentStoreName: string, loadConfig?: ComponentLoadConfig) {
    super();

    BaseDynamicComponent.instanceCount++;
    this.componentStoreName = `${componentStoreName}-${BaseDynamicComponent.instanceCount}`;

    this.formSelector = new FormSelector();
    createComponentStore(this.componentStoreName, this);

    this.eventHandlerData = new EventHandlerData(`data-${this.componentStoreName}-element-id`);

    if (loadConfig) {
      const self = this;

      self.requestStoreReducer = loadConfig.onLoadStoreConfig?.dataSource;

      Object.keys(loadConfig).forEach((configField: any) => {
        if (!validComponentLoadConfigFields.includes(configField)) {
          throw new Error(
            `Invalid component load config field ${configField} for ${self.localName}. Valid fields are
            ${validComponentLoadConfigFields}`,
          );
        }
      });

      const globalStateLoadConfig = loadConfig.globalStateLoadConfig;

      if (globalStateLoadConfig?.globalFieldSubscriptions) {
        globalStateLoadConfig.globalFieldSubscriptions.forEach(function (
          fieldName: string,
        ) {
          subscribeComponentToGlobalField(self, fieldName);
          self.componentLoadConfig = loadConfig;
        });
      } else {
        initRequestStoresOnLoad(loadConfig);
      }

      if (loadConfig.requestThunkReducers) {
        const component = this;

        loadConfig.requestThunkReducers.forEach(function (
          config: RequestThunkReducerConfig,
        ) {
          if (!config.thunk) {
            throw new Error(
              `Missing thunk field in ${self.componentStoreName} reducer configuration`,
            );
          }
          config.thunk.subscribeComponent(
            component.componentStoreName,
            config.componentStoreReducer,
            config.reducerField,
          );
        });
      }
    }
  }

  updateWithStoreData(data: any) {
    this.eventHandlerData.resetData();
    this.generateAndSaveHTML(data);

    if(this.shadowRoot){
      this.formSelector.setShadowRoot(this.shadowRoot);
    }

    this.eventHandlerData.attachEventHandlersToDom(this.shadowRoot);
  }

  updateStore(data: any) {
    updateComponentStore(this.componentStoreName, function(){return data})
  }

  generateAndSaveHTML(data: any) {
    if (!this.dependenciesLoaded) {
      this.innerHTML = generateLoadingIndicator();
    } else {
      this.formSelector.clearFormSelectors();
      this.innerHTML = this.render(data);
    }
  }

  generateInputFormItem(formConfig:FormInputConfig){
    return this.formSelector.generateInputFormSelector(formConfig);
  }

  generateTextInputFormItem(formConfig:FormInputConfig){
    return this.formSelector.generateTextInputFormItem(formConfig);
  }

  createOnChangeEvent(eventConfig: any) {
    return this.eventHandlerData.createOnChangeEvent(eventConfig, this.formSelector, this.componentStoreName);
  }

  createSubmitEvent(eventConfig: any) {
    return this.eventHandlerData.createSubmitEvent(eventConfig, this.formSelector, this.componentStoreName);
  }

  createClickEvent(eventConfig: any, params?: any) {
    return this.eventHandlerData.createClickEvent(eventConfig, this.formSelector, this.componentStoreName, params);
  }

  disconnectedCallback(){
    clearSubscribers(this.componentStoreName);
  }

  updateFromGlobalState() {

    const componentLoadConfig = this.componentLoadConfig;
    if(!componentLoadConfig){
      throw new Error(`Component load config is not defined for component ${this.componentStoreName}`)
    }
    const globalStateLoadConfig =
      componentLoadConfig.globalStateLoadConfig;
    if (!globalStateLoadConfig) {
      throw new Error(`Component global state config is not defined for component ${this.componentStoreName}`);
    }

    const dataSource = componentLoadConfig?.onLoadStoreConfig?.dataSource;

    let loadStatus: LoadStatus = {};
    if(dataSource){
      loadStatus = dataSource.initRequestStoreData(
        componentLoadConfig,
        this.componentStoreName)


    } else {
      let reducer = componentLoadConfig.globalStateLoadConfig?.defaultGlobalStateReducer;
      if(!reducer){
        reducer = function (updates: Record<string, string>) {
          return updates
        }
      }

      loadStatus.dependenciesLoaded = true;
      let dataToUpdate: Record<string, string> = {};

      componentLoadConfig.globalStateLoadConfig?.globalFieldSubscriptions?.forEach(
        function (fieldName) {
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

    if(loadStatus && loadStatus.dependenciesLoaded) {
      this.dependenciesLoaded = true;
    }
  }
  abstract render(data: Record<any, DisplayItem> | any): string;
}
