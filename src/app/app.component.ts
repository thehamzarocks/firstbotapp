import { Component } from '@angular/core';
import { FirstBotService } from './first-bot.service';
import { Observable } from 'rxjs';
import { IStartConversationResponse } from './startconversationresponse';
import { IReceiveActivityWholeResponse } from './receiveactivtywholeresponse';

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

  ReceiveFromWit() {
    this._firstbotservice.ReceiveFromWit()
      .subscribe(response => console.log(response));
  }
  
}
