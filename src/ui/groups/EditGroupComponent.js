import {
  ApiLoadAction,
  DataStore,
  PresentationComponent,
} from "/lib/places-js-latest.js";

import { API_ROOT } from "/shared/Params.js";

import { EDIT_GROUP_STORE } from "/data/groups/GroupInfoStore.js";

import {
  getGameTypeTagSelectHtml,
  getTagSelectedState,
} from "/shared/html/SelectGenerator.js";

export class GroupEditComponent extends PresentationComponent {
  constructor() {
    super();

    const updateGroup = () => {
      const elements =
        this.getRootNode().getElementById("edit-group-form")?.elements;

      const validationErrors = {};
      const groupDescription = this.getRootNode()
        .getElementById("group-description-input")
        ?.value.trim();

      console.log(groupDescription.length);
      if (!groupDescription || groupDescription.length === 0) {
        validationErrors["groupDescriptionError"] =
          "Description is a required field";
      }

      const groupName =
        this.getRootNode().getElementById("group-name-input")?.value;

      if (!groupName || groupName.length === 0) {
        validationErrors["groupNameError"] = "Name is a required field";
      }

      if (Object.keys(validationErrors).length > 0) {
        console.log("errors");
        EDIT_GROUP_STORE.updateStoreData({
          errors: validationErrors,
        });
        return;
      }

      const storeData = EDIT_GROUP_STORE.getStoreData();
      const params = JSON.stringify({
        id: storeData.id,
        name: groupName,
        description: groupDescription,
        image:
          this.querySelector("#image-upload-ui").getAttribute("image-path"),
        url: elements.namedItem("group-url-input")?.value,
        gameTypeTags: Object.keys(getTagSelectedState(this.getRootNode())),
      });

      console.log(encodeURIComponent(groupName));
      ApiLoadAction.getResponseData({
        body: params,
        method: "PUT",
        url: API_ROOT + `/groups/?name=${encodeURIComponent(groupName)}`,
      }).then((data) => {
        if (!data.errorMessage) {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          EDIT_GROUP_STORE.updateStoreData({
            successMessage: "Group update successful",
          });
        } else {
          EDIT_GROUP_STORE.updateStoreData({
            saveErrorMessage: data.errorMessage,
          });
        }
      });
    };

    this.setClickEvents({
      updateGroup: updateGroup,
    });

    this.setStore(EDIT_GROUP_STORE);
  }
}
