import type { LoginComponentStore } from "./LoginComponentStore.ts";
import {IS_LOGGED_IN_KEY} from "../../../shared/Constants.ts";

export class AuthResponse {
  private readonly loggedIn: boolean;
  private readonly data: any;
  private readonly error: string;
  constructor(loggedIn: boolean, data?: any, error?: string) {
    this.loggedIn = loggedIn;
    this.data = data;
    this.error = error ?? "";
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getData(): any {
    return this.data;
  }

  getErrorMessage(): string {
    return (this.error || this.error.length > 0) ?
      this.error.toString():
      "";
  }
}

export function generateDefaultLoginComponentStore(): LoginComponentStore {
  return {
    [IS_LOGGED_IN_KEY]: false,
    errorMessage: "",
    email: "",
  };
}
