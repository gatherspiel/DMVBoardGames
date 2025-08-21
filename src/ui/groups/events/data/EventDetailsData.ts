import type {UserPermissionData} from "../../../../shared/types/UserPermissionData.ts";
import {SUCCESS_MESSAGE_KEY} from "../../../../shared/Constants.ts";

export type EventDetailsData = {
  name: string;
  description: string;
  groupName: string;
  permissions: UserPermissionData;
  isEditing?: boolean;
  isDeleting?: boolean;
  day: string
  startTime: string
  endTime: string;
  location: string;
  url: string;
  errorMessage?: string;
  [SUCCESS_MESSAGE_KEY]?: string;
}