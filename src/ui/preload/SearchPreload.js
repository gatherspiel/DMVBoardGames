


const IS_LOCAL = !window.location.href.includes(
  "https://dmvboardgames.com/",
);

let API_ROOT = "http://localhost:7070"

if(!IS_LOCAL){
  API_ROOT = "https://api.gatherspiel.com"
}

const start = Date.now();

//@ts-ignore
window.waitingForPreload = true;
fetch(`${API_ROOT}/searchEvents`,{priority: 'high'}).then((response)=>{
  return response.json()
}).then((response)=>{
  //@ts-ignore
  window.preloadData = response;

  console.log(response);
  //@ts-ignore
  window.waitingForPreload = false;
})


