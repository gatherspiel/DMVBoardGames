export interface LoginComponentStore {
  isLoggedIn: boolean;
  errorMessage?: string;
  email?: string;
  successMessage?: string;
  hasAttemptedLogin?: boolean
}
