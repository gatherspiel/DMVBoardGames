import type { DisplayItem } from "../../../../homepage/data/types/DisplayItem.ts";
import type { Event } from "../../../../homepage/data/types/Event.ts";
import type {UserPermissionData} from "../../../../../shared/types/UserPermissionData.ts";

export interface GroupPageData extends DisplayItem {
  id: string;
  name: string;
  description: string;
  url: string;
  eventData: Event[];
  permissions: UserPermissionData;
  saveGroupSuccess: boolean;
}
