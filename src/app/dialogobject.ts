import { IIntentObject } from "./intentobject";

export interface IDialogObject {
    dialog: string;
    intents: IIntentObject[];
}