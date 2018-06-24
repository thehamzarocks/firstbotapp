import { IDialogObject } from "./dialogobject";

export interface IDialogSequenceObject {
    _id: string;
    dsname: string; //dialog sequence name
    dialogs: IDialogObject[];
}