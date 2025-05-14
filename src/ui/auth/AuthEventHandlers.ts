import { AUTH_STATE, LOGIN_FORM_ID, USERNAME_INPUT } from "./Constants.js";
import { updateRequestState } from "../../framework/state/RequestStateManager.ts";

export function setupEventHandlers() {
  console.log("Setting up event handlers for authentication");

  const form = document.getElementById(LOGIN_FORM_ID);

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      updateRequestState(AUTH_STATE, function () {
        return {
          username:
            (document.getElementById(USERNAME_INPUT) as HTMLInputElement)
              ?.value ?? "",
          password:
            (document.getElementById(USERNAME_INPUT) as HTMLInputElement)
              ?.value ?? "",
        };
      });
    });
  }
}
