export function serializeJSONProp(data: any) {
  let json = JSON.stringify(data);
  return json.replaceAll(" ", "\u00A0");
}

export function deserializeJSONProp(component: HTMLElement, propName: string) {
  const jsonStr = component.getAttribute(propName)!.replaceAll("\u00A0", " ");
  return JSON.parse(jsonStr);
}
