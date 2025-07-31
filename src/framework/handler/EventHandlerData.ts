import type {FormSelector} from "../FormSelector.ts";
import type {EventHandlerThunkConfig} from "../state/update/event/types/EventHandlerThunkConfig.ts";
import {BaseDispatcher} from "../state/update/BaseDispatcher.ts";
import {EventHandlerAction} from "../state/update/event/EventHandlerAction.ts";
import {EventThunk} from "../state/update/event/EventThunk.ts";
import type {EventValidationResult} from "../state/update/event/types/EventValidationResult.ts";
import {getComponentStore} from "../state/data/ComponentStore.ts";

type EventConfig = {
  eventType: string;
  eventFunction: (e: Event) => any;
};

export class EventHandlerData {

  eventHandlerConfig:Record<string, EventConfig>;
  eventTagIdCount = 0;
  elementIdTag:string;

  constructor(elementIdTag:string){
    this.eventHandlerConfig = {};
    this.elementIdTag = elementIdTag;
  }

  resetData(){
    this.eventHandlerConfig = {};
    this.eventTagIdCount = 0;
  }

  attachEventHandlersToDom(shadowRoot?:any){
    const eventHandlers = this.eventHandlerConfig;
    const elementIdTag = this.elementIdTag;

    const addEventHandler = function (item: Element) {
      const id = item.getAttribute(elementIdTag) ?? "";
      const eventConfig = eventHandlers[id];
      item.addEventListener(eventConfig.eventType, eventConfig.eventFunction);
    };

    if (shadowRoot) {
      shadowRoot?.querySelectorAll(`[${elementIdTag}]`).forEach(function (
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

  createOnChangeEvent(eventConfig: any, formSelector:FormSelector, componentStoreName:string) {
    const eventHandler = this.#createHandler(
      eventConfig,
      formSelector,
      componentStoreName,
    );
    return this.#saveEventHandler(eventHandler, "change");
  }

  createSubmitEvent(eventConfig: any, formSelector:FormSelector, componentStoreName:string) {
    let eventHandler;
    eventHandler = this.#createHandler(
      eventConfig,
      formSelector,
      componentStoreName,
    );
    return this.#saveEventHandler(eventHandler, "submit");
  }

  createClickEvent(eventConfig: any, formSelector:FormSelector, componentStoreName:string, params?: any) {
    let eventHandler;
    eventHandler = this.#createHandler(
      eventConfig,
      formSelector,
      componentStoreName,
      params,
    );
    return this.#saveEventHandler(eventHandler, "click");
  }

  #saveEventHandler(
    eventFunction: (e: Event) => any,
    eventType: string,
  ): string {
    let eventId = `${this.elementIdTag}=${this.eventTagIdCount}`;

    this.eventHandlerConfig[this.eventTagIdCount] = {
      eventType: eventType,
      eventFunction: eventFunction,
    };
    this.eventTagIdCount++;
    return eventId;
  }

  #createHandler(
    eventConfig: EventHandlerThunkConfig,
    formSelector: FormSelector,
    componentStoreName: string,
    params?: any
  ) {


    const dispatchers: BaseDispatcher[] = [];
    let componentStoreUpdate = new BaseDispatcher(
        componentStoreName,
        eventConfig.componentReducer,
      );
    dispatchers.push(componentStoreUpdate);

    const requestStoreToUpdate = eventConfig.apiRequestThunk?.getRequestStoreId();
    if(requestStoreToUpdate){
      const storeUpdate = new BaseDispatcher(requestStoreToUpdate, (a: any): any => {
        return a;
      });
      dispatchers.push(storeUpdate);
    }

    const request: EventHandlerAction = new EventHandlerAction(
      eventConfig.eventHandler,
      componentStoreName,
      formSelector,
      params
    );

    const eventUpdater: EventThunk = new EventThunk(request, dispatchers);

    const handler = function (e: Event) {

      e.preventDefault();

      const validatorFunction = eventConfig.validator;
      if (validatorFunction) {
        const validator = function (): EventValidationResult {
          const componentData = getComponentStore(componentStoreName);
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

}