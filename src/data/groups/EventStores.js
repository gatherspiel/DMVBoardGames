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
