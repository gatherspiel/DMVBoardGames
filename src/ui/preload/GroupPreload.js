function getData(){
  const IS_LOCAL = !window.location.href.includes(
    "https://dmvboardgames.com/",
  );

  const API_ROOT = IS_LOCAL ? "http://localhost:7070" : "https://api.dmvboardgames.com"
  const AUTH_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthcnF5c2t1dWRudmZ4b2h3a29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5ODQ5NjgsImV4cCI6MjA1NzU2MDk2OH0.TR-Pn6dknOTtqS9y-gxK_S1-nw6TX-sL3gRH2kXJY_I"


  let params = new URLSearchParams(document.location.search);
  let name = params.get("name") ?? "";

  const AUTH_TOKEN_KEY = IS_LOCAL ? "sb-localhost-auth-token" : "sb-karqyskuudnvfxohwkok-auth-token";
  const authToken = window.localStorage.getItem(AUTH_TOKEN_KEY);

  let headers = IS_LOCAL ? {} : {'apikey': AUTH_KEY};

  if(authToken !== null){
    const data = JSON.parse(authToken);
    const authData = data.access_token;
    headers.authToken = authData;
  }

  fetch(`${API_ROOT}/groups?name=${encodeURIComponent(name)}`,{
    headers: headers
  }).then((response)=>{
    return response.json();
  }).then((response)=>{
    //@ts-ignore
    window.preloadData = response;
  })
}

getData();