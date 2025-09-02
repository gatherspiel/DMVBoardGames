const DISPLAY_NAME_MAPPING:Record<string, string> = {
  "Washington": "DC",
  "0":"0 miles",
  "5": "5 miles",
  "10": "10 miles",
  "15": "15 miles",
  "30": "30 miles",
  "50": "50 miles"
}

export function getDisplayName(name:string):string {
  return DISPLAY_NAME_MAPPING[name] ?? name;
}
