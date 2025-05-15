import {
  AUTH_REQUEST_STATE,
  LOGIN_FORM_ID,
  PASSWORD_INPUT,
  USERNAME_INPUT,
} from "./Constants.js";
import { updateRequestState } from "../../framework/state/RequestStateManager.ts";

export function setupEventHandlers() {
  const form = document.getElementById(LOGIN_FORM_ID);

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      updateRequestState(AUTH_REQUEST_STATE, function () {
        return {
          username:
            (document.getElementById(USERNAME_INPUT) as HTMLInputElement)
              ?.value ?? "",
          password:
            (document.getElementById(PASSWORD_INPUT) as HTMLInputElement)
              ?.value ?? "",
        };
      });
    });
  }
}
