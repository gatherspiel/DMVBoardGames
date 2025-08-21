import {SUCCESS_MESSAGE_KEY} from "../../../../shared/Constants.ts";

export type DeleteGroupData = {
  isVisible: boolean;
  errorMessage: string;
  existingGroupName: string;
  [SUCCESS_MESSAGE_KEY]: string;
};
