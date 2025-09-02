import type {DropdownConfigItem} from "@bponnaluri/places-js";

export const DEFAULT_SEARCH_PARAMETER: string = "any";

export const DAYS_IN_WEEK: DropdownConfigItem[] = [
  {index:0, name:DEFAULT_SEARCH_PARAMETER},
  {index:1,name: "Sunday"},
  {index:2, name:"Monday"},
  {index:3, name:"Tuesday"},
  {index:4, name:"Wednesday"},
  {index:5, name:"Thursday"},
  {index:6, name:"Friday"},
  {index:7, name:"Saturday"}
];

export const DISTANCE_OPTIONS: DropdownConfigItem[] = [
  {index:0, name:"0"},
  {index:1,name: "5"},
  {index:2, name:"10"},
  {index:3, name:"15"},
  {index:4, name:"30"},
  {index:5, name:"50"},
];

export const SEARCH_CITY_ID: string = "search-cities";
export const SEARCH_FORM_ID: string = "search-form";
