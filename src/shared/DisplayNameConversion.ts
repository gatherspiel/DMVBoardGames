
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
  if(name in DISPLAY_NAME_MAPPING){
    return DISPLAY_NAME_MAPPING[name];
  }
  return name;
}

export function getDisplayNameArray(names:string[]):string[] {
  const updatedNames:string[] = [];
  names.forEach(name=>{
    updatedNames.push(getDisplayName(name))
  })
  return updatedNames;
}