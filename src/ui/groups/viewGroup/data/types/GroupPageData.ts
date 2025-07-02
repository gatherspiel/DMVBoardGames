import type { DisplayItem } from "../../../../homepage/data/types/DisplayItem.ts";
import type { Event } from "../../../../homepage/data/types/Event.ts";
import type { PermissionData } from "../../../../auth/types/PermissionData.ts";

export interface GroupPageData extends DisplayItem {
  id: string;
  name: string;
  description: string;
  url: string;
  eventData: Event[];
  permissions: PermissionData;
  saveGroupSuccess: boolean;
}
