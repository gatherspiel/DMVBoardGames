export type FormItemConfig = {
    componentLabel: string,
    id: string,
    value?: string, //If the value is undefined, a previous input value will be used if it is present.
    inputType: string,
    className?:string,
    lineBreakAfterLabel?: boolean,
}


export type FormConfig = {
    componentLabel: string,
    id: string,
    fieldName: string //If the value is undefined, a previous input value will be used if it is present.
    inputType: string,
    className?:string,
    lineBreakAfterLabel?: boolean,
}