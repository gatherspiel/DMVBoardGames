export function setLoadFunction(loadFunction) {
  if (typeof window.onload === "function") {
    console.error("Init function has already been defined");
    return;
  }
  window.onload = loadFunction;
}
