const loadFunctions = {};

export function addLoadFunction(componentName, loadFunction) {
  if (componentName in loadFunctions) {
  } else {
    loadFunctions[componentName] = loadFunction;
  }
}

window.onload = (event) => {
  Object.keys(loadFunctions).forEach(function (componentName) {
    loadFunctions[componentName]();
  });
};
