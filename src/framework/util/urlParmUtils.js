export function getParameter(paramName) {
  let params = new URLSearchParams(document.location.search);
  return params.get(paramName);
}

export function showExperimental() {
  let params = new URLSearchParams(document.location.search);
  return params.get("experimental") === "true";
}
