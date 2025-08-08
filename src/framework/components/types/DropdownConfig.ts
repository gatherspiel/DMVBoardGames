import type {EventHandlerThunkConfig} from "../../state/update/event/types/EventHandlerThunkConfig.ts";

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
  defaultParameter: string,
  defaultParameterDisplay:string,
  eventHandlerConfig: EventHandlerThunkConfig,

}