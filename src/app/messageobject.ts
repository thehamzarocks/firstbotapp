import { ISelectorObject } from "./selectorobject";

export interface IMessageObject {
    currentdsName: string;
    currentDialog: string;
    currentIntent: string;
    currentStateValue: string;
    currentText: string;
    autofetch: boolean;
    being: string;        
}