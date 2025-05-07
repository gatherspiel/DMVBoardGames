export const API_ROOT = window.location.href.includes(
  "https://dmvboardgames.com/",
)
  ? `https://${import.meta.env.VITE_API_ROOT}`
  : import.meta.env.VITE_LOCAL_API_ROOT;
