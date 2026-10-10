import { ApiLoadAction, DataStore } from "/lib/places-js-latest.js";
import { API_ROOT } from "/shared/Params.js";
import { LOGIN_STATUS_STORE } from "/data/user/LoginStatusStore";

const name =
  new URLSearchParams(document.location.search).get("name") ?? "";


/*
function getGroupDataConfig() {
  return {
    url: API_ROOT + `/groups/?name=${encodeURIComponent(name)}`,
  };
}
*/

function getEventDataConfig(){
  //TODO: Add logic here
}

export const EVENT_STORE = new DataStore(
  new ApiLoadAction(getGroupDataConfig),
  "event-store"
);
EVENT_STORE.fetchData();

 export const USER_EVENT_ACTION_STORE = DataStore.createWithDataStoreSignals({
  presentationSignals:{
    update: { 
      "deleteEventText":()=>"Delete event"
      "deleteEventUrl":()=>{
        return window.location.href.replace("event.html","/event/delete.html");
      },
      "editEventText":()=>"Edit event"
      "editEventUrl":()=>{
        return window.location.href.replace("event.html","/event/edit.html");
      },
      "loggedIn":(data)=>{
        console.log(data);  
        return data.permissions.userCanUpdateGroupMembership ? "visible" : "hidden"
      }
    }
  },
  storeSignals:[{
    "store":EVENT_STORE
  }],
  storeName:"user-event-action-store"
});

export const ADD_EVENT_STORE = DataStore.createWithDataStoreSignals({
  presentationSignals:{
    data: {
      update: {
      }
    }
  },
  storeSignals:[{
    "fieldName": "data",
    "selector": (data)=>{

    },
    "store"EVENT_STORE
  }],
  storeName:"event-store"
});

const defaultUrl = "https://dmvboardgames.com/groups/event.html"

const getUrl = (event)=>{
  if(data.url && !data.url.startsWith(defaultUrl)){
    return event.url;
  }
  return "";
}

export const VIEW_EVENT_STORE = DataStore.createWithDataStoreSignals({
  presentationSignals:{
    data: {
      update: {
        "eventTime": (event)=>{
          if(event.isRecurring){
            return `${event.day}s from ${event.startTime} to ${event.endTime}`; 
          }
          return `${event.startData}, ${event.startTime}`;
        },
        "moderatorHTML": (event)=>{
          return `
            <div>
              <p>Test to see if HTML will update</p>
            </div>
          `
          if (!event.moderators || event.moderators.length === 0) {
            return ``;
          }
          let moderatorHasUsername = false;
          for (let i = 0; i < data.moderators.length; i++) {
            if (data.moderators[i]?.userData?.username.length > 0) {
              moderatorHasUsername = true;
              break;
            }
          }
          if (!moderatorHasUsername) {
            return ``;
          }

          let html = ``;
          event.moderators.forEach((moderator) => {
            html += `
              <div class ="user-data-div">
                <div class="user-data-div-inner"> 
                  <div class="user-image-div">
                    ${moderator.userData.imageFilePath ? `<img class="user-image-icon" src="${moderator.userData.imageFilePath}"></img>` : ``}
                  </div>
                  <div class="username-div">
                    <span><b>${data.hostText}</b> ${moderator.userData.username}</span>
                  </div>
                </div>
              </div>
            `;
          });
          return html;

        },
       "showImage":(event)=>{
          if(event.imageFilePath){
            return "visible";
          }
          return "hidden";
        },
        "showUrl":(event)=>{
          if(getUrl(event)){
            return "visible";
          }
          return "hidden";
        },
        "userCanRsvp":(event)=>{
          return event?.permissions?.userCanRsvp;
        },
        "url":(event)=>{
          return getUrl(event); 
        }
      }
    }
  },
  storeSignals:[{
    "fieldName": "data",
    "selector": (data)=>{

    },
    "store"EVENT_STORE
  }],
  storeName:"event-store"
});



export const UPDATE_EVENT_STORE = DataStore.createWithDataStoreSignals({
  presentationSignals:{
    data: {
      update: {
      }
    }
  },
  storeSignals:[{
    "fieldName": "data",
    "selector": (data)=>{

    },
    "store"EVENT_STORE
  }],
  storeName:"event-store"
});

export const DELETE_EVENT_STORE = DataStore.createWithDataStoreSignals({
  presentationSignals:{
    data: {
      update: {
      }
    }
  },
  storeSignals:[{
    "fieldName": "data",
    "selector": (data)=>{

    },
    "store"EVENT_STORE
  }],
  storeName:"event-store"
});
