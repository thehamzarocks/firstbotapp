import { ISelectorObject } from "./selectorobject";

export interface IIntentObject {
    _id: string;
    type: string;
    dsname: string;
    dialog: string;
    intent: string;
    response: string;
    nextdialog: string;
    nextds: string;
    being: string;
    fallback: string;
    operation: string;
    op1: string;
    op2: string;
    autofetch: string;
    statename: string;
    statevalue: string;
    nextstatename: string;
    selectors: ISelectorObject[];
}