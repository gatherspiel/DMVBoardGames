import type { BaseDynamicComponent } from "../../components/BaseDynamicComponent.ts";

let globalState: Record<string, any> = {};

let globalStateCreated: boolean = false;
let globalStateSubscribers: Record<string, BaseDynamicComponent[]> = {};

export function getGlobalStateValueIfPresent(fieldName: string): string | null{

  if (!(fieldName in globalState)) {
    return null;
  }
  return globalState[fieldName];
}

export function setupGlobalState(fields: Record<string, any>) {
  if (globalStateCreated) {
    return;
  }

  Object.values(fields).forEach( (fieldName: string)=> {
    globalState[fieldName] = "";
  });

  globalStateCreated = true;
}

export function updateGlobalStore(fieldsToUpdate: Record<string, any>) {

  const err = new Error();

  const caller = err?.stack?.split("\n")[1];

  if(caller && !caller.startsWith("updateStore") && !caller.includes("framework/state/update/BaseThunk.ts")){
    err.message = "Cannot directly update global store from this function "
    throw err;
  }

  let componentsToUpdate = new Set();
  Object.keys(fieldsToUpdate).forEach((fieldName: string)=> {
    if (!(fieldName in globalState)) {
      throw new Error(
        `Invalid field ${fieldName} for global store. Make sure field is configured as a field name using setupGlobalState`,
      );
    }

    if (
      globalState[fieldName] !== fieldsToUpdate[fieldName] &&
      fieldName in globalStateSubscribers
    ) {
      globalStateSubscribers[fieldName].forEach( (
        component: BaseDynamicComponent,
      ) => {
        componentsToUpdate.add(component);
      });
    }

    globalState[fieldName] = fieldsToUpdate[fieldName];
  });

  componentsToUpdate.forEach( (component: any) =>{
    component.updateFromGlobalState(structuredClone(globalState));
  });
}

export function subscribeComponentToGlobalField(
  component: BaseDynamicComponent,
  fieldName: string,
) {
  if (!(fieldName in globalState)) {
    throw new Error(
      `Component id: ${component.componentId} cannot subscribe to field ${fieldName}.
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

  component.updateFromGlobalState(structuredClone(globalState))
}

export function clearGlobalStore(){
  Object.keys(globalState).forEach(key=>{
    globalState[key] = {};
  });

  globalStateSubscribers = {};
}
