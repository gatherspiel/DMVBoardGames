const loadFunctions: Record<string, () => any> = {};

export function addLoadFunction(componentName: string, loadFunction: any) {
  if (componentName in loadFunctions) {
  } else {
    loadFunctions[componentName] = loadFunction;
  }
}

window.onload = () => {
  Object.keys(loadFunctions).forEach(function (componentName: string) {
    loadFunctions[componentName]();
  });
};
