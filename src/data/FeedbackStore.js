import { DataStore } from "/lib/places-js-latest.js";

const presentationSignals = {
  update: {
    isSuccess: (data) => {
      if (data.successMessage) {
        return "inherit";
      }
      return "none";
    },
  },
};

export const FEEDBACK_STORE = DataStore.createWithInitialState({
  initialState: {},
  presentationSignals: presentationSignals,
  storeName: "edit-profile-store",
});
