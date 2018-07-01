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
    value: number;
    autofetch: string;
    statename: string;
    statevalue: string;
}