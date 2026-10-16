import {
  ApiLoadAction,
  DataStore,
  PresentationComponent,
} from "/lib/places-js-latest.js";
import {
  ERROR_MESSAGE_KEY,
  SUCCESS_MESSAGE_KEY,
  generateErrorMessage,
  generateSuccessMessage,
} from "../../shared/html/StatusIndicators.js";

import {
  GROUP_DESCRIPTION,
  GROUP_DESCRIPTION_INPUT,
  GROUP_NAME_INPUT,
  GROUP_URL_INPUT,
} from "./Constants.js";

import {
  getGameTypeTagSelectHtml,
  getTagSelectedState,
} from "../../shared/html/SelectGenerator.js";

import { API_ROOT } from "/shared/Params.js";

import { ImageUploadComponent } from "../../shared/components/ImageUploadComponent.js";
import { LOADING_INDICATOR_CONFIG } from "../../shared/LoadingIndicatorConfig.js";
import { RsvpComponent } from "./RsvpComponent.js";
import { convertDayOfWeekForDisplay } from "../../shared/DisplayNameConversion.js";

customElements.define("image-upload-component", ImageUploadComponent);

const CANCEL_UPDATES_BUTTON_ID = "cancel-updates";
const EDIT_GROUP_BUTTON_ID = "edit-group-button";
const JOIN_GROUP_BUTTON_ID = "join-group-button";
const SAVE_UPDATES_BUTTON_ID = "save-updates";

const DESCRIPTION_ERROR_TEXT_KEY = "descriptionErrorText";
const NAME_ERROR_TEXT_KEY = "nameErrorText";

const groupDataStore = new DataStore(
  new ApiLoadAction(() => {
    const name =
      new URLSearchParams(document.location.search).get("name") ?? "";
    return {
      url: API_ROOT + `/groups/?name=${encodeURIComponent(name)}`,
    };
  }),
);
export class GroupEditComponent extends PresentationComponent {
  constructor() {
    super(
      [
        {
          componentReducer: (groupData) => {
            return {
              ...groupData,
              [SUCCESS_MESSAGE_KEY]: "",
            };
          },
          dataStore: groupDataStore,
        },
      ],
      LOADING_INDICATOR_CONFIG,
    );

    groupDataStore.fetchData();
    const self = this;

    this.addEventListener("click", (event) => {
      const targetId = event.target?.id;

      if (!event.target.type === "checkbox") {
        event.preventDefault();
      }

      if (targetId === JOIN_GROUP_BUTTON_ID) {
        const userIsMember = self.componentStore.permissions?.userIsMember;
        const apiMethod = userIsMember ? "DELETE" : "POST";

        ApiLoadAction.getResponseData({
          method: apiMethod,
          url: API_ROOT + `/user/memberData/group/${self.componentStore.id}`,
        }).then((response) => {
          const error = response[ERROR_MESSAGE_KEY];
          if (!error) {
            let permissions = Object.assign(
              {},
              self.componentStore.permissions,
            );
            permissions.userIsMember = !userIsMember;
            self.updateData({
              [ERROR_MESSAGE_KEY]: "",
              [SUCCESS_MESSAGE_KEY]: "",
              permissions: permissions,
            });
          } else {
            self.updateData({
              [ERROR_MESSAGE_KEY]: error,
              [SUCCESS_MESSAGE_KEY]: "",
            });
          }
        });
      } else if (targetId === EDIT_GROUP_BUTTON_ID) {
        self.updateData({
          isEditing: true,
          [DESCRIPTION_ERROR_TEXT_KEY]: "",
          [ERROR_MESSAGE_KEY]: "",
          [NAME_ERROR_TEXT_KEY]: "",
          [SUCCESS_MESSAGE_KEY]: "",
        });
      } else if (targetId === CANCEL_UPDATES_BUTTON_ID) {
        self.updateData({
          isEditing: false,
        });
      } else if (targetId === SAVE_UPDATES_BUTTON_ID) {
        const validationErrorState = { [SUCCESS_MESSAGE_KEY]: "" };
        const groupName = self
          .getRootNode()
          .getElementById(GROUP_NAME_INPUT)?.value;
        if (!groupName || groupName.length === 0) {
          validationErrorState[NAME_ERROR_TEXT_KEY] =
            "Name is a required field";
        }
        const groupDescription = self
          .getRootNode()
          .getElementById(GROUP_DESCRIPTION_INPUT)?.value;
        if (!groupDescription || groupDescription.length === 0) {
          validationErrorState[DESCRIPTION_ERROR_TEXT_KEY] =
            "Description is a required field";
        }

        const imageForm = self.getRootNode().getElementById("image-upload-ui");
        const params = {
          description: groupDescription,
          gameTypeTags: Object.keys(getTagSelectedState(self.getRootNode())),
          image: imageForm.getImage(),
          imageFilePath: imageForm.getImageFilePath(),
          id: self.componentStore.id,
          name: groupName,
          url: self.getRootNode().getElementById(GROUP_URL_INPUT)?.value,
        };
        if (Object.keys(validationErrorState).length > 1) {
          self.updateData({ ...validationErrorState, ...params });
          return;
        }
        ApiLoadAction.getResponseData({
          body: JSON.stringify(params),
          method: "PUT",
          url: API_ROOT + `/groups/?name=${encodeURIComponent(params.name)}`,
        }).then((data) => {
          if (!data.errorMessage) {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
            self.updateData({
              ...params,
              isEditing: false,
              imagePath: params.image || params.imageFilePath,
              [SUCCESS_MESSAGE_KEY]: "Group update successful",
            });
          } else {
            self.updateData({
              ...params,
              [ERROR_MESSAGE_KEY]: data.errorMessage,
            });
          }
        });
      }
    });
  }
}
