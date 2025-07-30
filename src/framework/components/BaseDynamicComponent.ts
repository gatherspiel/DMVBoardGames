import type { DisplayItem } from "../../ui/homepage/data/types/DisplayItem.ts";

import {
  clearSubscribers,
  createComponentStore,
  getComponentStore, updateComponentStore,
} from "../state/data/ComponentStore.ts";
import {
  initRequestStoresOnLoad,
} from "../state/data/RequestStore.ts";
import { EventHandlerAction } from "../state/update/event/EventHandlerAction.ts";
import { BaseDispatcher } from "../state/update/BaseDispatcher.ts";
import { EventThunk } from "../state/update/event/EventThunk.ts";
import type { EventHandlerThunkConfig } from "../state/update/event/types/EventHandlerThunkConfig.ts";
import {
  type ComponentLoadConfig,
  type ThunkDispatcherConfig,
  validComponentLoadConfigFields,
} from "./types/ComponentLoadConfig.ts";
import type {BaseThunk, LoadStatus} from "../state/update/BaseThunk.ts";
import {
  getGlobalStateValue,
  subscribeComponentToGlobalField,
} from "../state/data/GlobalStore.ts";
import type { EventValidationResult } from "../state/update/event/types/EventValidationResult.ts";
import type {FormItemConfig} from "./types/FormItemConfig.ts";
import  {FormSelector} from "../FormSelector.ts";

type EventConfig = {
  eventType: string;
  eventFunction: (e: Event) => any;
};

export abstract class BaseDynamicComponent extends HTMLElement {
  componentStoreName: string;
  eventHandlerConfig: Record<string, EventConfig>;
  eventTagIdCount = 0;

  requestStoreReducer?: BaseThunk;

  instanceId: number;

  dependenciesLoaded: boolean = true;
  componentLoadConfig: ComponentLoadConfig | undefined = undefined;

  formSelector: FormSelector
  static instanceCount = 1;

  constructor(componentStoreName: string, loadConfig?: ComponentLoadConfig) {
    super();

    this.instanceId = BaseDynamicComponent.instanceCount;
    BaseDynamicComponent.instanceCount++;
    this.eventHandlerConfig = {};
    this.componentStoreName = `${componentStoreName}-${BaseDynamicComponent.instanceCount}`;

    this.formSelector = new FormSelector();
    createComponentStore(this.componentStoreName, this);

    if (loadConfig) {
      const self = this;

      self.requestStoreReducer = loadConfig.onLoadStoreConfig?.dataSource;

      Object.keys(loadConfig).forEach((configField: any) => {
        if (!validComponentLoadConfigFields.includes(configField)) {
          throw new Error(
            `Invalid component load config field ${configField} for ${self.componentStoreName}. Valid fields are
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

      if (loadConfig.thunkReducers) {
        const component = this;

        loadConfig.thunkReducers.forEach(function (
          config: ThunkDispatcherConfig,
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
    this.eventHandlerConfig = {};
    this.eventTagIdCount = 0;

    this.generateAndSaveHTML(data);
    this.attachEventHandlersToDom();
  }

  updateStore(data: any) {
    updateComponentStore(this.componentStoreName, function(){return data})
  }

  attachEventHandlersToDom() {
    const eventHandlers = this.eventHandlerConfig;
    const elementIdTag = this.getElementIdTag();

    const addEventHandler = function (item: Element) {
      const id = item.getAttribute(elementIdTag) ?? "";
      const eventConfig = eventHandlers[id];
      item.addEventListener(eventConfig.eventType, eventConfig.eventFunction);
    };

    if (this.shadowRoot) {
      this.formSelector.setShadowRoot(this.shadowRoot);
      this.shadowRoot?.querySelectorAll(`[${elementIdTag}]`).forEach(function (
        item: Element,
      ) {
        addEventHandler(item);
      });
    } else {
      document.querySelectorAll(`[${elementIdTag}]`).forEach(function (
        item: Element,
      ) {
        addEventHandler(item);
      });
    }
  }

  generateAndSaveHTML(data: any) {
    if (!this.dependenciesLoaded) {
      this.innerHTML = this.getLoadingIndicator();
    } else {
      this.formSelector.clearFormSelectors();
      this.innerHTML = this.render(data);
    }
  }

  getLoadingIndicator(){
    return `<h1>Loading</h1>`
  }

  getElementIdTag() {
    return `data-${this.componentStoreName}-element-id`;
  }

  generateErrorMessage(message: string | string[] | undefined){
    if(Array.isArray(message)){
      let html = ''
      message.forEach((item)=>{
        html+=`<p class="error-message">${item.trim()}</p>`

      })
      return html;
    }
    return `
      <p class="error-message">${message? message.trim() : ""}</p>
        `
  }

  generateSuccessMessage(message: string | undefined){
    return `
      ${message  ? `<p class="success-message">${message}</p>` : ''}
    `
  }

  generateInputFormItem(formConfig:FormItemConfig){

    let formValue = formConfig.value;
    if(!formValue && this.formSelector.hasValue(formConfig.id)){
      formValue = this.formSelector.getValue(formConfig.id);
    }

    this.formSelector.addFormSelector(formConfig.id);
    return `
      <label for=${formConfig.id}>${formConfig.componentLabel}</label>
      ${formConfig.lineBreakAfterLabel !== false? `<br>` : ''}
      <input
        ${formConfig.className ? `class="${formConfig.className}"` : ``}
        id=${formConfig.id}
        name=${formConfig.id}
        type=${formConfig.inputType}
        value="${formValue}"
        />
        <br>
    `
  }

  generateTextInputFormItem(formConfig:FormItemConfig){
    let formValue = formConfig.value;
    if(!formValue && this.formSelector.hasValue(formConfig.id)){
      formValue = this.formSelector.getValue(formConfig.id);
    }
    this.formSelector.addFormSelector(formConfig.id);

    return `
      <label for=${formConfig.id}>${formConfig.componentLabel}</label>
      ${formConfig.lineBreakAfterLabel !== false? `<br>` : ''}
      <textarea
        ${formConfig.className ? `class="${formConfig.className}"` : ``}
        id=${formConfig.id}
        name=${formConfig.id}
        type=${formConfig.inputType}
        />${formValue}
      </textarea>
      <br>
    `
  }

  saveEventHandler(
    eventFunction: (e: Event) => any,
    eventType: string,
  ): string {
    let id = `${this.getElementIdTag()}=${this.eventTagIdCount}`;

    this.eventHandlerConfig[this.eventTagIdCount] = {
      eventType: eventType,
      eventFunction: eventFunction,
    };
    this.eventTagIdCount++;
    return id;
  }

  createOnChangeEvent(eventConfig: any) {
    const eventHandler = BaseDynamicComponent.createHandler(
      eventConfig,
      this.formSelector,
      this?.componentStoreName,
    );
    return this.saveEventHandler(eventHandler, "change");
  }

  createSubmitEvent(eventConfig: any) {
    let eventHandler;
    eventHandler = BaseDynamicComponent.createHandler(
      eventConfig,
      this.formSelector,
      this?.componentStoreName,
    );
    return this.saveEventHandler(eventHandler, "submit");
  }

  createClickEvent(eventConfig: any, params?: any) {
    let eventHandler;
    eventHandler = BaseDynamicComponent.createHandler(
      eventConfig,
      this.formSelector,
      this.componentStoreName,
      params,
    );
    return this.saveEventHandler(eventHandler, "click");
  }

  static createHandler(
    eventConfig: EventHandlerThunkConfig,
    formSelector: FormSelector,
    componentStoreName?: string,
    params?: any
  ) {

    const eventThunk = eventConfig.apiRequestThunk;
    const storeToUpdate =
      eventThunk?.getRequestStoreId();


    const dispatchers: BaseDispatcher[] = [];
    let componentStoreUpdate: any;


    if (componentStoreName) {
      componentStoreUpdate = new BaseDispatcher(
        componentStoreName,
        eventConfig.componentReducer,
      );
      dispatchers.push(componentStoreUpdate);
    }


    const handler = function (e: Event) {

      e.preventDefault();

      const request: EventHandlerAction = new EventHandlerAction(
        eventConfig.eventHandler,
        componentStoreName,
        formSelector,
        params
      );

      if(storeToUpdate){
        const storeUpdate = new BaseDispatcher(storeToUpdate, (a: any): any => {
          return a;
        });
        dispatchers.push(storeUpdate);
      }

      const eventUpdater: EventThunk = new EventThunk(request, dispatchers);

      if (eventConfig.validator) {
        const eventConfigValidator = eventConfig.validator;
        const validator = function (): EventValidationResult {
          const componentData = getComponentStore(componentStoreName ?? "");
          return eventConfigValidator(formSelector, componentData);
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
