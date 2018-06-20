import { IReceiveActivityResponse } from "./receiveactivityresponse";

export interface IReceiveActivityWholeResponse {
    activities: IReceiveActivityResponse[];
    watermark: string;
}