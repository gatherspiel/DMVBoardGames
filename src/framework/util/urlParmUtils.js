export function getParameter(paramName) {
  let params = new URLSearchParams(document.location.search);
  return params.get(paramName);
}
