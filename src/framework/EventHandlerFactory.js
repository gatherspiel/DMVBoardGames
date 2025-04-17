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
export function dispatchCustomEvent(componentName, eventName, data) {
  if (!components.includes(componentName)) {
    console.error("Attempting to dispatch event for invalid component");
    return;
  }
  const event = new Event(getCustomEventName(componentName, eventName), data);
  document.dispatchEvent(event);
}
