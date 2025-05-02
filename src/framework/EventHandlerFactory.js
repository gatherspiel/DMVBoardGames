const components = [];

export function registerComponent(componentName) {
  if (components.includes(componentName)) {
    console.error("Attempting to register component twice");
    return;
  }
  components.push(componentName);
}

export function getCustomEventName(componentName, eventName) {
  return componentName + "_" + eventName;
}
