export const API_ROOT: string = window.location.href.includes(
  "https://dmvboardgames.com/",
)
  ? `${import.meta.env.VITE_API_ROOT}`
  : import.meta.env.VITE_LOCAL_API_ROOT;

export const USE_MOCK: boolean = import.meta.env.VITE_USE_API_MOCK === "true";
