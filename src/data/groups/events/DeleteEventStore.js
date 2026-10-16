import { DataStore } from "/lib/places-js-latest.js";
import { EVENT_STORE } from "./EventStore.js";
export const DELETE_EVENT_STORE = DataStore.createWithDataStoreSignals({
  storeSignals: [
    {
      store: EVENT_STORE,
    },
  ],
  presentationSignals: {
    update: {
      errorMessage: (state) => state.errorMessage,
      formTitle: (state) => {
        return new URLSearchParams(document.location.search).get("name");
      },
      successMessage: (state) => state.successMessage,
      successStyle: (state) => {
        if (state.successMessage) {
          return "callout success";
        }
      },
    },
  },
  storeName: "delete-event-store",
});
