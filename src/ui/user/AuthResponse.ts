export class AuthResponse {
  private readonly loggedIn: boolean;
  private readonly data: any;
  private readonly errorMessage: string;
  constructor(loggedIn: boolean, data?: any, error?: string) {
    this.loggedIn = loggedIn;
    this.data = data;
    this.errorMessage = error ?? "";
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getData(): any {
    return this.data;
  }

  getErrorMessage(): string {
    return (this.errorMessage || this.errorMessage.length > 0) ?
      this.errorMessage.toString():
      "";
  }
}