import {IS_LOGGED_IN_KEY, SUCCESS_MESSAGE_KEY} from "../../../shared/Constants.ts";

export interface LoginComponentStore {
  [IS_LOGGED_IN_KEY]: boolean;
  errorMessage?: string;
  email?: string;
  [SUCCESS_MESSAGE_KEY]?: string;
  hasAttemptedLogin?: boolean
}
