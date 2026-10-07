import { ApiLoadAction, DataStore } from "/lib/places-js-latest.js";
import { API_ROOT } from "/shared/Params.js";

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


//TODO: ADD updates here
export const GROUP_ONE_TIME_EVENT_STORE = DataStore.createWithDataStoreSignals({
  presentationSignals:{
    data: {
      update: { 
      }
    }
  },
  storeSignals:[{
    "fieldName": "data",
    "selector": (data)=>{
      const events = []
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
