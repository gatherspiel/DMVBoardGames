import { ApiLoadAction, DataStore } from "/lib/places-js-latest.js";
import { API_ROOT } from "/shared/Params.js";

import { convertDateAndDayToDisplayString } from "../../shared/EventDataUtils.js";
function getUserMemberDataStore() {
  return {
    url: API_ROOT + "/user/memberData",
  };
}

export const USER_MEMBER_STORE = new DataStore(
  new ApiLoadAction(getUserMemberDataStore),
);

USER_MEMBER_STORE.fetchData();

export const MODERATING_GROUPS_STORE = DataStore.createWithDataStoreSignals({
  presentationSignals:{
    data: {
      update: {
        "groupUrl":(data)=>{
          console.log(data);
          return `/html/groups/groups.html?name=${encodeURIComponent(data.name)}`
        },
        "groupName":(data)=>data.name
      }
    }
  },
  storeSignals:[{
    "fieldName": "data",
    "selector": (data)=>{
      return data.moderatingGroups;
    },
    "store":USER_MEMBER_STORE,
  }],
  storeName:"moderating-groups-store"
})

export const MODERATING_EVENTS_STORE = DataStore.createWithDataStoreSignals({
  presentationSignals:{
    data: {
      update: {
        "eventId":(data)=>data.eventId,
        "eventTimeDisplay":(data)=>{
          console.log(data);
          return convertDateAndDayToDisplayString(
            data.startDate,
            data.day
          ) + data.startTime;
        },
        "groupId":(data)=>data.groupId
      }
    }
  },
  storeSignals:[{
    "selector": (data)=>data.moderatingEvents,
    "store":USER_MEMBER_STORE,
  }],
  storeName:"moderating-events-store"
})

export const JOINED_GROUPS_STORE = DataStore.createWithDataStoreSignals({
  presentationSignals:{
    data:{
      update: {
        "groupNameUri":(data)=>encodeURIComponent(data.groupName)
      }
    }
  },
  storeSignals:[{
    "selector": (data)=>data.joinedGroups,
    "store":USER_MEMBER_STORE
  }],
  storeName:"joined-groups-store"
})


export const ATTENDING_EVENTS_STORE = DataStore.createWithDataStoreSignals({
  presentationSignals:{
    data: {
      update: { 
        "eventId":(data)=>data.eventId,
        "eventTimeDisplay":(data)=>{
            return convertDateAndDayToDisplayString(
              data.startDate,
              data.day
            ) + data.startTime;
          } 
        },
        "groupId":(data)=>data.groupId
    }
  },
  storeSignals:[{
    "selector": (data)=>data.joinedGroups,
    "store":USER_MEMBER_STORE
  }],
  storeName:"attending-events-store"
})
