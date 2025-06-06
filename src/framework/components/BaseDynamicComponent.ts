import type { DisplayItem } from "../../ui/events/data/types/DisplayItem.ts";

import {
  createComponentStore,
  getComponentStore,
  hasComponentStoreSubscribers,
} from "../store/data/ComponentStore.ts";
import {
  hasRequestStoreSubscribers,
  initRequestStoresOnLoad,
  updateRequestStoreAndClearCache,
} from "../store/data/RequestStore.ts";
import { EventHandlerAction } from "../store/update/event/EventHandlerAction.ts";
import { BaseDispatcher } from "../store/update/BaseDispatcher.ts";
import { EventThunk } from "../store/update/event/EventThunk.ts";
import type { EventHandlerThunkConfig } from "../store/update/event/types/EventHandlerThunkConfig.ts";
import {
  type ComponentLoadConfig,
  type ThunkReducerConfig,
  validComponentLoadConfigFields,
} from "./types/ComponentLoadConfig.ts";
import { subscribeComponentToGlobalField } from "../store/data/StoreUtils.ts";
import type { BaseThunk } from "../store/update/BaseThunk.ts";

type EventConfig = {
  eventType: string;
  eventFunction: (e: Event) => any;
};

export abstract class BaseDynamicComponent extends HTMLElement {
  componentStoreName: string;
  eventHandlers: Record<string, EventConfig>;
  eventTagIdCount = 0;

  requestStoreName?: string;
  requestStoreReducer?: BaseThunk;

  instanceId: number;

  static instanceCount = 1;

  constructor(componentStoreName: string, loadConfig?: ComponentLoadConfig) {
    super();

    this.instanceId = BaseDynamicComponent.instanceCount;
    BaseDynamicComponent.instanceCount++;
    this.eventHandlers = {};

    this.componentStoreName = `${componentStoreName}-${BaseDynamicComponent.instanceCount}`;

    createComponentStore(this.componentStoreName, this);

    if (loadConfig) {
      const self = this;

      self.requestStoreName = loadConfig.onLoadStoreConfig?.storeName;
      self.requestStoreReducer = loadConfig.onLoadStoreConfig?.dataSource;

      Object.keys(loadConfig).forEach((configField: any) => {
        if (!validComponentLoadConfigFields.includes(configField)) {
          throw new Error(
            `Invalid component load config field ${configField} for ${self.componentStoreName}. Valid fields are
            ${validComponentLoadConfigFields}`,
          );
        }
      });

      initRequestStoresOnLoad(loadConfig);

      if (loadConfig.globalFieldSubscriptions) {
        loadConfig.globalFieldSubscriptions.forEach(function (
          fieldName: string,
        ) {
          subscribeComponentToGlobalField(self, fieldName);
        });
      }

      // TODO: Handle case where there are multiple instances of a component that each need different state
      if (loadConfig.thunkReducers) {
        const component = this;

        loadConfig.thunkReducers.forEach(function (config: ThunkReducerConfig) {
          if (!config.thunk) {
            throw new Error(
              `Missing thunk field in ${self.componentStoreName} reducer configuration`,
            );
          }
          config.thunk.subscribeComponent(
            component.componentStoreName,
            config.componentReducerFunction,
            config.reducerField,
          );
        });
      }
    }
  }

  updateStore(data: any) {
    this.eventHandlers = {};
    this.eventTagIdCount = 0;

    this.generateAndSaveHTML(data);

    const eventHandlers = this.eventHandlers;
    const elementIdTag = this.getElementIdTag();

    const addEventHandler = function (item: Element) {
      const id = item.getAttribute(elementIdTag) ?? "";
      const eventConfig = eventHandlers[id];

      item.addEventListener(eventConfig.eventType, eventConfig.eventFunction);
    };

    if (this.shadowRoot) {
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
    this.innerHTML = this.render(data);
  }

  getElementIdTag() {
    return `data-${this.componentStoreName}-element-id`;
  }
  //TODO: Handle case where there are multiple instances of the same component when generating the ids for event handlers.
  saveEventHandler(
    eventFunction: (e: Event) => any,
    eventType: string,
    targetId?: string,
  ): string {
    let id = `${this.getElementIdTag()}=${this.eventTagIdCount}`;

    this.eventHandlers[this.eventTagIdCount] = {
      eventType: eventType,
      eventFunction: eventFunction,
    };
    this.eventTagIdCount++;

    if (targetId) {
      id += ` id=${targetId}`;
    }
    return id;
  }

  createOnChangeEvent(eventConfig: any) {
    const eventHandler = BaseDynamicComponent.createHandler(
      eventConfig,
      this?.componentStoreName,
    );
    return this.saveEventHandler(eventHandler, "change");
  }

  createSubmitEvent(eventConfig: any) {
    let eventHandler;
    if (this.shadowRoot) {
      eventHandler = BaseDynamicComponent.createHandler(
        eventConfig,
        this?.componentStoreName,
        this?.shadowRoot,
      );
    } else {
      eventHandler = BaseDynamicComponent.createHandler(
        eventConfig,
        this?.componentStoreName,
      );
    }
    return this.saveEventHandler(eventHandler, "submit");
  }

  createClickEvent(eventConfig: any, id?: string) {
    const eventHandler = BaseDynamicComponent.createHandler(
      eventConfig,
      this?.componentStoreName,
    );
    return this.saveEventHandler(eventHandler, "click", id);
  }

  static createHandler(
    eventConfig: EventHandlerThunkConfig,
    storeName?: string,
    shadowRoot?: ShadowRoot,
  ) {
    const storeToUpdate =
      eventConfig?.storeToUpdate && eventConfig.storeToUpdate.length > 0
        ? eventConfig.storeToUpdate
        : storeName;

    if (!storeToUpdate) {
      throw new Error("Event handler must be associated with a valid state");
    }

    const handler = function (e: Event) {
      if (
        !hasRequestStoreSubscribers(storeToUpdate) &&
        !hasComponentStoreSubscribers(storeToUpdate)
      ) {
        throw new Error(`No subscribers for store ${storeToUpdate}`);
      }

      e.preventDefault();

      const request: EventHandlerAction = new EventHandlerAction(
        eventConfig.eventHandler,
        storeName,
        shadowRoot,
      );

      const storeUpdate = new BaseDispatcher(storeToUpdate, (a: any): any => {
        return a;
      });
      const eventUpdater: EventThunk = new EventThunk(request, [storeUpdate]);
      eventUpdater.processEvent(e);
    };

    return handler;
  }

  updateFromGlobalState(data: any) {
    console.log("Updated state:" + JSON.stringify(data));
    const componentData = getComponentStore(this.componentStoreName);
    if (this.requestStoreName) {
      updateRequestStoreAndClearCache(this.requestStoreName, {
        name: componentData.name,
      });
    }
  }

  abstract render(data: Record<any, DisplayItem> | any): string;
}
