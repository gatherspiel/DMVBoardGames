import { USER_DATA_STORE } from "/data/user/UserDataStore.js";
import { DataStore, PresentationComponent } from "/lib/places-js-latest.js";

const presentationSignals = {
  update: {
    errorMessage: (data) => {
      if (data.errorMessage) {
        return data.errorMessage;
      }
      return "";
    },
    imageFilePath: (data) => {
      return data?.userData?.imageFilePath;
    },
    successMessage: (data) => {
      console.log(data);
      if (data.successMessage) {
        return data.successMessage;
      }
      return "";
    },
    usernameInput: (data) => {
      if (data?.userData?.username) {
        return data.userData.username;
      }
      return "";
    },
    usernameError: (data) => {
      if (data["username-error-text"]) {
        return data["username-error-text"];
      }
      return "";
    },
  },
};

export const EDIT_PROFILE_STORE = DataStore.createWithDataStoreSignals({
  storeSignals: [
    {
      field: "userData",
      store: USER_DATA_STORE,
    },
  ],
  presentationSignals: presentationSignals,
  storeName: "edit-profile-store",
});

EDIT_PROFILE_STORE.fetchData();
