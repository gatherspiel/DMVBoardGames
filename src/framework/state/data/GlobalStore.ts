import type { BaseDynamicComponent } from "../../components/BaseDynamicComponent.ts";

let globalState: Record<string, string> = {};

let globalStateCreated: boolean = false;
let globalStateSubscribers: Record<string, BaseDynamicComponent[]> = {};

export function getGlobalStateValue(fieldName: string): string {
  if (!(fieldName in globalState)) {
    throw new Error(`Could not find ${fieldName} in global state`);
  }
  return globalState[fieldName];
}

export function setupGlobalState(fields: Record<string, string>) {
  if (globalStateCreated) {
    return;
    //throw new Error("Global state has already been initialized");
  }

  Object.values(fields).forEach(function (fieldName: string) {
    globalState[fieldName] = "";
  });

  globalStateCreated = true;
}

export function updateGlobalStore(fieldsToUpdate: Record<string, string>) {
  let componentsToUpdate = new Set();
  Object.keys(fieldsToUpdate).forEach(function (fieldName: string) {
    if (!(fieldName in globalState)) {
      throw new Error(
        `Invalid field ${fieldName} for global store. Make sure field is configured as a field name using setupGlobalState`,
      );
    }

    if (
      globalState[fieldName] !== fieldsToUpdate[fieldName] &&
      fieldName in globalStateSubscribers
    ) {
      globalStateSubscribers[fieldName].forEach(function (
        component: BaseDynamicComponent,
      ) {
        componentsToUpdate.add(component);
      });
    }

    globalState[fieldName] = fieldsToUpdate[fieldName];
  });

  componentsToUpdate.forEach(function (component: any) {
    component.updateFromGlobalState(structuredClone(globalState));
  });
}

export function subscribeComponentToGlobalField(
  component: BaseDynamicComponent,
  fieldName: string,
) {
  if (!(fieldName in globalState)) {
    throw new Error(
      `Component id: ${component.componentStoreName} cannot subscribe to field ${fieldName}.
       Make sure the field is configured as a field name using setupGlobalState`,
    );
  }

  if (!(fieldName in globalStateSubscribers)) {
    globalStateSubscribers[fieldName] = [component];
  } else {
    if (!globalStateSubscribers[fieldName].includes(component)) {
      globalStateSubscribers[fieldName].push(component);
    }
  }
}
