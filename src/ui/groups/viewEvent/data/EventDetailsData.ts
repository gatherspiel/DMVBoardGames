import type {UserPermissionData} from "../../../../shared/types/UserPermissionData.ts";

export type EventDetailsData = {
  name: string;
  description: string;
  groupName: string;
  permissions: UserPermissionData;
  isEditing?: boolean;
}