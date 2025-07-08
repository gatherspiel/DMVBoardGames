import type {FormSelector} from "../../../../FormSelector.ts";

export interface EventHandlerData {
  event?: Event;
  componentStore?: any;
  targetId: string;
  formSelector: FormSelector
}
