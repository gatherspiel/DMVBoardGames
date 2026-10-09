import { ApiLoadAction, DataStore } from "/lib/places-js-latest.js";
import { API_ROOT } from "/shared/Params.js";
import { LOGIN_STATUS_STORE } from "/data/user/LoginStatusStore";
const name =
  new URLSearchParams(document.location.search).get("name") ?? "";

function getGroupDataConfig() {
  return {
    url: API_ROOT + `/groups/?name=${encodeURIComponent(name)}`,
  };
}

export const GROUP_STORE = new DataStore(
  new ApiLoadAction(getGroupDataConfig),
  "group-store"
);

GROUP_STORE.fetchData();

export const GROUP_SUMMARY_STORE = DataStore.createWithDataStoreSignals({
  presentationSignals:{
    update: {
      "description":(data)=>{
        return data.description
      },
      "name":(data)=>{
        return data.name;
      },
      "url":(data)=>data.groupUrl, 
      "groupImage":(data)=>{
        if(data.imagePath){
          return `<img id="group-image" src="${data.imagePath}"/>`
        }
        return "";
      }
    }
  },
  storeSignals:[{
    "store":GROUP_STORE,
  }],
  storeName:"group-summary-store"
})


export const GROUP_WEEKLY_EVENT_STORE = DataStore.createWithDataStoreSignals({
  presentationSignals:{
    data: {
      update: {
        "eventTime":(data)=>{
          console.log(data);
          const dayString = convertDayOfWeekForDisplay(data.day);
          return `${dayString}s from ${data.startTime} to ${data.endTime}`
        },
        "key":(data)=>{
          return `${data.groupId}-event-${data.id}`
        },
        "location":(data)=>{
          return data.location
        },
        "rsvpCount": (data)=>data.rsvpCount,
        "url": (data)=>{
          const eventId = encodeUriComponent(data.id);
          const groupId = encodeUriComponent(data.groupId);
          return `/html/groups/event.html?id=${eventId}&groupId=${groupId}`
        },
        "userCanRsvp": (data)=>data.permissions.userCanRsvp,
        "userHasRsvp":(data)=>data.userHasRsvp,        
      }
    }
  },
  storeSignals:[{
    "fieldName": "data",
    "selector": (data)=>{

      const events = []
      if(!data.weeklyEventData){
        return events;
      }
      data.weeklyEventData.forEach((event)=>{
        event.groupId = data.groupId;
        events.push(event);
      });
      return events;
    },
    "store":GROUP_STORE
  }],
  storeName:"group-weekly-event-store"
});


export const GROUP_ONE_TIME_EVENT_STORE = DataStore.createWithDataStoreSignals({
  presentationSignals:{
    data: {
      update: { 
        "eventTime":(data)=>{
          console.log(data);
          const dayString = convertDayOfWeekForDisplay(data.day);
          return `${dayString}s from ${data.startTime} to ${data.endTime}`
        },
        "key":(data)=>{
          return `${data.groupId}-event-${data.id}`
        },
        "location":(data)=>{
          return data.location
        },
        "rsvpCount": (data)=>data.rsvpCount,
        "url": (data)=>{
          const eventId = encodeUriComponent(data.id);
          const groupId = encodeUriComponent(data.groupId);
          return `/html/groups/event.html?id=${eventId}&groupId=${groupId}`
        },
        "userCanRsvp": (data)=>data.permissions.userCanRsvp,
        "userHasRsvp":(data)=>data.userHasRsvp,
      }
    }
  },
  storeSignals:[{
    "fieldName": "data",
    "selector": (data)=>{
      const events = []
      if(!data.oneTimeEventData){
        return [];
      }
      data.oneTimeEventData.forEach((event)=>{
        event.groupId = data.groupId;
        events.push(event);
      });
      return events;
    },
    "store":GROUP_STORE
  }],
  storeName:"group-one-time-event-store"
});

 export const USER_GROUP_ACTION_STORE = DataStore.createWithDataStoreSignals({
  presentationSignals:{
    update: { 
      "addEventUrl":(data)=>{
        return `/html/groups/addEvent.html?name=${encodeURIComponent(data.name)}&id=${encodeURIComponent(data.id)}`;
      },
      "deleteGroupUrl":(data)=>{
        return `/html/groups/delete.html?name=${encodeURIComponent(data.name)}&id=${encodeURIComponent(data.id)}`;
      },
      "editGroupUrl":(data)=>{
        return `/html/groups/edit.html?name=${encodeURIComponent(data.name)}&groupId=${encodeURIComponent(data.id)}`;
      },
      "encodedGroupName": (data)=>encodeURIComponent(data.name),    
      "encodedId": (data)=>encodeURIComponent(data.id),
      "joinGroupText":(data)=>data.permissions.userIsMember ? "Leave group": "Join group",
      "joinGroupUrl":(data)=>{
        return `/html/groups/join.html?name=${encodeURIComponent(data.name)}&groupId=${encodeURIComponent(data.id)}`;

      },
      "loggedIn":(data)=>{
        return data.permissions.userCanUpdateGroupMembership ? "visible" : "hidden"
      }
    }
  },
  storeSignals:[{
    "store":GROUP_STORE
  }],
  storeName:"user-group-action-store"
});

export const EDIT_GROUP_STORE = DataStore.createWithDataStoreSignals({
  presentationSignals:{
    update: { 
      "groupDescriptionError":(data)=>data?.errors?.groupDescriptionError,
      "groupNameError":(data)=>data?.errors?.groupNameError,
      "saveErrorMessage":(data)=>data.saveErrorMessage,
      "successStyle":(data)=>{
        return data?.successMessage?.length>0 ? "callout success" : "";
      },
      "successMessage":(data)=>{
        if(data.successMesasge){
          return data.successMessage;
        }
        return '';
      }
    }
  },
  storeSignals:[{
    "store":GROUP_STORE
  }],
  storeName:"edit-group-store"
});
