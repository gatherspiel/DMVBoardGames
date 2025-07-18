


const IS_LOCAL = !window.location.href.includes(
  "https://dmvboardgames.com/",
);

let API_ROOT = "http://localhost:7070"

if(!IS_LOCAL){
  API_ROOT = "https://api.dmvboardgames.com"
}

const start = Date.now();
fetch(`${API_ROOT}/searchEvents`,{priority: 'high'}).then((response)=>{
  console.log(Date.now()-start);
  return response.json()
}).then((response)=>{
  //@ts-ignore
  window.preloadData = response;
})


