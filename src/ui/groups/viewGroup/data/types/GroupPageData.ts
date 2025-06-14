import type { DisplayItem } from "../../../../events/data/types/DisplayItem.ts";
import type { Event } from "../../../../events/data/types/Event.ts";
import type { PermissionData } from "../../../../auth/types/PermissionData.ts";

export interface GroupPageData extends DisplayItem {
  name: string;
  summary: string;
  url: string;
  eventData: Event[];
  permissions: PermissionData;
  saveGroupSuccess: boolean;
}
