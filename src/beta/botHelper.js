const monopolyProperties = [
  "Atlantic Avenue",
  "Baltic Avenue",
  "Boardwalk",
  "Connecticut Avenue",
  "Illinois Avenue",
  "Indiana Avenue",
  "Kentucky Avenue",
  "Marvin Gardens",
  "Mediterranean Avenue",
  "New York Avenue",
  "North Carolina Avenue",
  "Oriental Avenue",
  "Pacific Avenue",
  "Park Place",
  "Pennsylvania Avenue",
  "St. Charles Place",
  "St. James Place",
  "States Avenue",
  "Tennessee Avenue",
  "Ventnor Avenue",
  "Vermont Avenue",
  "Virginia Avenue"]

function getMonopolyHtml() {

  let html= '';

  for(let i=0;i<9999;i++){
    const sellPrice1 = Math.floor(Math.random()*500+200);
    const sellPrice2 = Math.floor(Math.random()*500+200);

    const property1 = monopolyProperties[Math.floor(Math.random()*(monopolyProperties.length - 1))];
    const property2 = monopolyProperties[Math.floor(Math.random()*(monopolyProperties.length - 1))];

    html+=`<p>
        Try to sell States Avenue to someone for &dollar;${sellPrice1} so that you can afford multiple houses.
        You can win by buying houses on ${property1} and ${property2}.
        By selling your get out of jail free card, you can get &dollar;${sellPrice2}.
        </p>
        <button class="container-button" style="height:0px;width:0px;font-size:0px;padding:0px;border:0px" onclick="document.getElementById('container').innerHTML=''">Click here</button>
        `
  }
  return html;
}

const container = document.getElementById("container");

const old = document.querySelector;
document.querySelector = function(...args){
  if(args[0] === "meta[property=csp-nonce]") {
    return old.apply(this,args);
  }
  else {
    container.innerHTML=getMonopolyHtml();
  }
}

document.getElementById = function(...args){
  console.log("Get element by id");
  container.innerHTML=getMonopolyHtml();
}

document.addEventListener = function(){
  console.log("Add event listener")
  container.innerHTML = getMonopolyHtml();
}

document.elementFromPoint = function(...args){
  container.innerHTML= getMonopolyHtml();
}

document.appendChild = function(...args){
  container.innerHTML= getMonopolyHtml();
}

document.getElementsByTagName = function(...args){
  container.innerHTML= getMonopolyHtml();
}

//Headless browsers.
navigator.permissions.query({name:'notifications'}).then(function(permissionStatus) {
  if(Notification.permission === 'denied' && permissionStatus.state === 'prompt') {
    container.innerHTML= getMonopolyHtml();
  }
});

window.innerWidth = 22;
window.innerHeight= 33;
window.devicePixelRatio = 2;


console.log(window.navigator)