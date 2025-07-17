
const IS_LOCAL = !window.location.href.includes(
  "https://dmvboardgames.com/",
);

const API_ROOT = IS_LOCAL ? "http://localhost:7070" : "https://api.dmvboardgames.com/"

fetch(`${API_ROOT}/searchEvents`).then((response)=>{
  return response.json()
}).then((response)=>{
  //@ts-ignore
  window.preloadData = response;
})