import type { AuthError } from "@supabase/supabase-js";
import type { LoginComponentStore } from "./LoginComponentStore.ts";

export class AuthResponse {
  private readonly loggedIn: boolean;
  private readonly data: any;
  private readonly error: AuthError | undefined;
  constructor(loggedIn: boolean, data?: any, error?: AuthError) {
    this.loggedIn = loggedIn;
    this.data = data;
    this.error = error;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getData(): any {
    return this.data;
  }

  getErrorMessage(): string {
    if (this.error) {
      return this.error.toString();
    }
    return "";
  }
}

export function generateDefaultLoginComponentStore(): LoginComponentStore {
  return {
    isLoggedIn: false,
    errorMessage: "",
    email: "",
  };
}
