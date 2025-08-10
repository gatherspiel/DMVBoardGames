import type {EventHandlerThunkConfig} from "../../state/update/event/types/EventHandlerThunkConfig.ts";
import {
  DEFAULT_PARAMETER_DISPLAY_KEY,
  DEFAULT_PARAMETER_KEY,
  EVENT_HANDLER_CONFIG_KEY
} from "../../../shared/Constants.ts";

export type DropdownConfigItem = {
  index: number
  name:string
}

export type DropdownConfig = {
  label: string,
  id: string,
  name: string,
  data: DropdownConfigItem[],
  selected: string,
  [DEFAULT_PARAMETER_KEY]: string,
  [DEFAULT_PARAMETER_DISPLAY_KEY]:string,
  [EVENT_HANDLER_CONFIG_KEY]: EventHandlerThunkConfig,

}