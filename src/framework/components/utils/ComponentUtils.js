export function createJSONProp(data) {
  let json = JSON.stringify(data);
  return json.replaceAll(" ", "\u00A0");
}

export function retrieveJSONProp(component, propName) {
  const jsonStr = component.getAttribute(propName).replaceAll("\u00A0", " ");
  return JSON.parse(jsonStr);
}
