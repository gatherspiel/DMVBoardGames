import {DataStore} from "/lib/places-js-latest.js";

export const DELETE_GROUP_STORE = DataStore.createWithInitialState({
  initialState:{},
  presentationSignals:{
    update: {
      "errorMessage":(state)=>state.errorMessage,
      "formTitle":()=>{
        return new URLSearchParams(document.location.search).get("name");
      },
      "successMessage":(state)=>state.successMessage,
      "successStyle":(state)=>{
        if(state.successMessage){
          return "callout success";
        }
      }
    }
  },
  "storeName":"delete-group-store"
});
