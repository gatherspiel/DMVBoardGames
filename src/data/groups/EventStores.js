import { ApiLoadAction, DataStore } from "/lib/places-js-latest.js";
import { API_ROOT } from "/shared/Params.js";
import { LOGIN_STATUS_STORE } from "/data/user/LoginStatusStore";

const name =
  new URLSearchParams(document.location.search).get("name") ?? "";

function getEventRequestConfig() {
  return {
    url:
      API_ROOT +
      `/groups/events/${new URLSearchParams(document.location.search).get("id") ?? ""}/`,
  };
}

export const EVENT_STORE = new DataStore(
  new ApiLoadAction(getEventRequestConfig),
  "event-store"
);
EVENT_STORE.fetchData();

export const USER_EVENT_ACTION_STORE = DataStore.createWithDataStoreSignals({
  presentationSignals:{
    update: { 
      "createEventText":()=>{
        return "Create event"
      },
      "createEventUrl":()=>{
        return window.location.href.replace("event.html","events/create.html");
      },
      "deleteEventText":()=>{
        return "Delete event"
      },
      "deleteEventUrl":()=>{
        return window.location.href.replace("event.html","events/delete.html");
      },
      "editEventText":()=>{
        return "Edit event";
      },
      "editEventUrl":()=>{
        return window.location.href.replace("event.html","events/edit.html");
      },
      "loggedIn":(data)=>{
        return data.permissions.userCanEdit ? "visible" : "hidden"
      }
    }
  },
  storeSignals:[{
    "store":EVENT_STORE
  }],
  storeName:"user-event-action-store"
});


const defaultUrl = "https://dmvboardgames.com/groups/event.html"

const getUrl = (event)=>{
  if(event.url && !event.url.startsWith(defaultUrl)){
    return event.url;
  }
  return "";
}

export const VIEW_EVENT_STORE = DataStore.createWithDataStoreSignals({
  presentationSignals:{
      update: {
        "eventTime": (event)=>{
          if(event.data.isRecurring){
            return `${event.data.day}s from ${event.data.startTime} to ${event.data.endTime}`; 
          }
          return `${event.data.startData}, ${event.data.startTime}`;
        },
        "moderatorHTML": (event)=>{
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
        "name":(event)=>{
          return event.data.name;
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
  },
  storeSignals:[{
    "fieldName":"data",
    "store":EVENT_STORE
  }],
  storeName:"event-summary-store"
});
VIEW_EVENT_STORE.fetchData();

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
    "store":EVENT_STORE
  }],
  storeName:"update-event-store"
});
 
