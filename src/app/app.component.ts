import { Component } from '@angular/core';
import { FirstBotService } from './first-bot.service';
import { Observable } from 'rxjs';
import { IStartConversationResponse } from './startconversationresponse';
import { IReceiveActivityWholeResponse } from './receiveactivtywholeresponse';
import { IIntentObject } from './intentobject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private _firstbotservice:FirstBotService) {}
  title = 'app';
  conversationId = "hello";
  responseText = "";
  inputText = "";

  currentDialog: string = "";
  currentIntent: string = "";  



  StartConversation() {
      this._firstbotservice.StartConversation()
        .subscribe((firstresponse: IStartConversationResponse) => this.conversationId=firstresponse.conversationId);
  }

  SendActivity(inputText) {
    this._firstbotservice.SendActivity(inputText)
      .subscribe(response => console.log(response));
  }

  ReceiveActivity() {
    this._firstbotservice.ReceiveActivity()
      .subscribe((response:IReceiveActivityWholeResponse) => {
        console.log(response);
        this.responseText=response.activities[response.watermark].text;
      });
  }

  ReceiveFromWit(input: string) {
    this._firstbotservice.ReceiveFromWit(input)
      .subscribe(response => {
        var intent: string = response.entities.yes_no[0].value;
        this.currentIntent = intent;
      });
  }

  ReceiveBotResponse() {
    this._firstbotservice.RetrieveFirstBotResponse(this.currentDialog, this.currentIntent)
      .subscribe(response => {
        var intentObject: IIntentObject;        
        intentObject = response;
        console.log(intentObject.response);
        this.currentDialog = intentObject.nextDialog
        // this.currentIntent = "yes";
      });
  }
  
}
