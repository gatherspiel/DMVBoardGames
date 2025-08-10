import {SUCCESS_MESSAGE_KEY} from "../../../../../shared/Constants.ts";

export type CreateGroupData = {
  name: string;
  description: string;
  url: string;
  isVisible: boolean;
  errorMessage?: string;
  [SUCCESS_MESSAGE_KEY]?: string;
};
