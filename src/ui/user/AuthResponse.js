export class AuthResponse {
  constructor(loggedIn, data, error) {
    this.loggedIn = loggedIn;
    this.data = data;
    this.errorMessage = error ?? "";
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  getData() {
    return this.data;
  }

  getErrorMessage() {
    return this.errorMessage || this.errorMessage.length > 0
      ? this.errorMessage.toString()
      : "";
  }
}
