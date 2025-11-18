
export const IS_PRODUCTION = window.location.href.includes(
  "https://dmvboardgames.com/",
);
export const IS_TEST = window.location.href.includes(
  "https://dmvboardgames-60o0k.kinsta.page/",
);

export const API_ROOT =
  IS_PRODUCTION || IS_TEST
    ? `https://api.gatherspiel.com`
    : import.meta.env.VITE_LOCAL_API_ROOT;

export const SUPABASE_CLIENT_URL =
  IS_PRODUCTION || IS_TEST
    ? "https://karqyskuudnvfxohwkok.supabase.co"
    : import.meta.env.VITE_LOCAL_AUTH_URL;

export const SUPABASE_CLIENT_KEY =
  IS_PRODUCTION || IS_TEST
    ? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthcnF5c2t1dWRudmZ4b2h3a29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5ODQ5NjgsImV4cCI6MjA1NzU2MDk2OH0.TR-Pn6dknOTtqS9y-gxK_S1-nw6TX-sL3gRH2kXJY_I"
    : import.meta.env.VITE_LOCAL_AUTH_KEY;

export const AUTH_TOKEN_KEY = "authToken";

