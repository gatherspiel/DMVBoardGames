import type { LoginComponentStore } from "./LoginComponentStore.ts";

export class AuthResponse {
  private readonly loggedIn: boolean;
  private readonly data: any;
  private readonly error: string;
  constructor(loggedIn: boolean, data?: any, error?: string) {
    this.loggedIn = loggedIn;
    this.data = data;

    if (error) {
      this.error = error;
    } else {
      this.error = "";
    }
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getData(): any {
    return this.data;
  }

  getErrorMessage(): string {
    if (this.error || this.error.length > 0) {
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
