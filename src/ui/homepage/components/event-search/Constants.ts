import type {DropdownConfigItem} from "../../../../framework/components/types/DropdownConfig.ts";

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
  {index:0, name:"0 miles"},
  {index:1,name: "5 miles"},
  {index:2, name:"10 miles"},
  {index:3, name:"15 miles"},
  {index:4, name:"30 miles"},
  {index:5, name:"50 miles"},
];

export const SEARCH_CITY_ID: string = "search-cities";
export const SEARCH_FORM_ID: string = "search-form";
