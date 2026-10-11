import {DataStore} from "/lib/places-js-latest.js";

import {getDaysOfWeekSelect} from "/shared/html/SelectGenerator.js";

const groupName = new URLSearchParams(document.location.search).get("name");

export const CREATE_EVENT_STORE = DataStore.createWithInitialState({
  initialState:{},
  presentationSignals:{
    update: {
      "daysSelect":()=>{
        return getDaysOfWeekSelect();
      },
      "groupPageUrl":()=>{
        return `/html/groups/groups.html?name=${encodeURIComponent(groupName)}`;
      }, 
      "showSuccess":(data)=>{
        if(data.successMessage){
          return "visible";
        }
        return "hidden";
      },
      "title":()=>{
        return `Add event for group ${groupName}`;
      }
    }
  },
  storeName:"create-event-store"
});
