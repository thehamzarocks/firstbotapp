import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IStartConversationResponse } from './startconversationresponse';
import { IReceiveActivityWholeResponse } from './receiveactivtywholeresponse';
import { IDialogSequenceObject } from './dialogsequenceobject';
import { IIntentObject } from './intentobject';

const startConversationHttpOptions = {
  headers: new HttpHeaders({    
    'Authorization': 'Bearer 6Pak39YWbB0.cwA.6kg.O283ck7ACtGMI-R-Gqs6tLQreF0_eeCY0YPaKybleak'
  })
};

const sendActivityHttpOptions = {
  headers: new HttpHeaders({    
    // 'Authorization': 'Bearer 6Pak39YWbB0.cwA.6kg.O283ck7ACtGMI-R-Gqs6tLQreF0_eeCY0YPaKybleak',
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class FirstBotService {

  constructor(private http:HttpClient) { }

  startConversationUrl = 'https://directline.botframework.com/v3/directline/conversations';
  sendActivityUrl = 'https://directline.botframework.com/v3/directline/conversations/9b6FU9LwJpA4JMkYP8Y8Pp/activities';
  receiveActivityUrl = 'https://directline.botframework.com/v3/directline/conversations/9b6FU9LwJpA4JMkYP8Y8Pp/activities';

  
  
  StartConversation(): Observable<IStartConversationResponse> {
    return this.http.post<IStartConversationResponse>(this.startConversationUrl, '', startConversationHttpOptions);
  }

  SendActivity(inputText: string): Observable<any> {
    var body = {
      "type": "message",
      "from": {
          "id": "user1"
      },
      "text": inputText
    }
    console.log(inputText)
    console.log(body)
    return this.http.post<any>(this.sendActivityUrl, body, sendActivityHttpOptions);
  }

  ReceiveActivity(): Observable<IReceiveActivityWholeResponse> {
    return this.http.get<IReceiveActivityWholeResponse>(this.receiveActivityUrl,startConversationHttpOptions);
  }

  ReceiveFromWit(input: string):Observable<any> {
    var url: string =  'https://api.wit.ai/message?v=20180624&q=' + input;


    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer M5HYQXSTM2EOPKAMSQ472TSMIDHGOWXQ');
      
    return this.http.get(url,{headers:headers});
      
  }

  RetrieveFirstBotResponse (currentDialog: string, currentIntent: string): Observable<IIntentObject> {
    // var dialogsequence: IDialogSequenceObject = {
    //     dsname: "initial dialog sequence",
    //     dialogs: [
    //       {
    //         dialog: "",
    //         intents: [
    //           {intent: "",
    //            response: "Are you ready?",
    //           newdialog: "asked ready"}
    //         ]
    //       }
    //     ]
    // };

    var url: string = 'http://localhost:3000/retrieve';
    var requestbody = {
      "dialog": currentDialog,
      "intent": currentIntent
    }

    return this.http.post<IIntentObject>(url, requestbody, sendActivityHttpOptions);
  }
}
