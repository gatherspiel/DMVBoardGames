
const IS_LOCAL = !window.location.href.includes(
  "https://dmvboardgames.com/",
);

let API_ROOT = "http://localhost:7070"

if(!IS_LOCAL){
  API_ROOT = "https://api.dmvboardgames.com"
}

fetch(`${API_ROOT}/searchEvents`).then((response)=>{
  return response.json()
}).then((response)=>{
  //@ts-ignore
  window.preloadData = response;
})