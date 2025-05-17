import { IS_PRODUCTION } from "../../utils/params.ts";

export function getParameter(paramName: string): string {
  let params = new URLSearchParams(document.location.search);
  return params.get(paramName) ?? "";
}

export function showExperimental() {
  return !IS_PRODUCTION;
}
