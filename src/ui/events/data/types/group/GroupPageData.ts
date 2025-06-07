import type { DisplayItem } from "../DisplayItem.ts";
import type { Event } from "../Event.ts";
import type { PermissionData } from "../../../../auth/types/PermissionData.ts";

export interface GroupPageData extends DisplayItem {
  name: string;
  summary: string;
  url: string;
  eventData: Event[];
  permissions: PermissionData;
}
