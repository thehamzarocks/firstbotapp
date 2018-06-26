import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { FirstBotService } from '../../first-bot.service';
import { IIntentObject } from '../../intentobject';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/internal/Observable';
import { ReturnStatement } from '@angular/compiler';
import { IMessageObject } from '../../messageobject';
import { EMPTY } from 'rxjs';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  

  user: Observable<firebase.User>;
  items: Observable<any[]>;

  database;

  constructor(private _firstbotservice:FirstBotService, db: AngularFirestore) {
    this.database = db;
    this.items = db.collection('/DialogSequences').valueChanges();

    // var docRef = db.collection('/DialogSequences').ref;
    // var query = docRef.where("dialog", "==", "");
    // query.get().then((querySnapShot) => {
    //     querySnapShot.forEach((doc) => {
    //       console.log(`${doc.id} => ${doc.data().response}`);
    //     });
    // });
  
    
  

    this.messages = new Array<IMessageObject>();

    this.message = <IMessageObject>{
      currentdsName: "dream enigma start",
      currentDialog: "",
      currentIntent: "",
      currentText: "",
      being: "Enigma"
    };   
    
    this.fallBack = "I can't help you with that right now."
   }

  messages: IMessageObject[];
  message: IMessageObject;
  inputText: string = "";

  fallBack: string;
  

  
  ngOnInit() {
    // this._firstbotservice.RetrieveFirstBotResponse(this.currentDialog, this.currentIntent)
    // .subscribe(response => {
    //   var intentObject: IIntentObject;        
    //   intentObject = response;
    //   console.log(intentObject.response);
    //   this.messages.push(intentObject.response);
    //   this.currentDialog = intentObject.nextDialog;
    //   // this.currentIntent = "yes";
    // });

    var docRef = this.database.collection('/DialogSequences').ref;
    var query = docRef.where("dsname", "==", "dream enigma start").where("dialog", "==", "");
    query.get().then((querySnapShot) => {
        querySnapShot.forEach((doc) => {          
          var receivedMessage = this.getMessage(doc);
          console.log(this.message.currentdsName, this.message.currentDialog, this.message.currentIntent);
          this.messages.push(receivedMessage);
          this.message = receivedMessage;          
        });
    });

  }

  CallBot() : void {
    if(this.inputText == "") {
      return;
    }
    
    var sentMessage: IMessageObject = {      
      currentdsName: "",
      currentDialog: "",
      currentIntent: "",
      currentText: this.inputText,
      being: "You",      
    }    
    
    this.messages.push(sentMessage);    
    var input = this.inputText;
    this.inputText = "";
    this._firstbotservice.ReceiveFromWit(input)
      .subscribe(response => {
        if(response.entities.yes_no == undefined) {          
          var receivedMessage: IMessageObject = {
            currentdsName: this.message.currentdsName,
            currentDialog: this.message.currentDialog,
            currentIntent: this.message.currentIntent,
            currentText: this.fallBack,
            being: this.message.being,
          };
          this.messages.push(receivedMessage);
        }
        else {
          console.log(response.entities.yes_no);
          var intent: string = response.entities.yes_no[0].value;          
          this.message.currentIntent = intent;
          this.RetrieveDialog();
        }
    });
  }

  RetrieveDialog(): void {
    console.log(this.message.currentdsName, this.message.currentDialog, this.message.currentIntent);
    var docRef = this.database.collection('/DialogSequences').ref;
        var query = docRef.where("dsname", "==", this.message.currentdsName).where("dialog", "==", this.message.currentDialog).where("intent", "==", this.message.currentIntent);
        query.get().then((querySnapShot) => {          
          if(querySnapShot.docs.length == 0) {
            var receivedMessage: IMessageObject = {
              currentdsName: this.message.currentdsName,
              currentDialog: this.message.currentDialog,
              currentIntent: this.message.currentIntent,
              currentText: this.fallBack,
              being: this.message.being,
            };
            this.messages.push(receivedMessage);
          }

          querySnapShot.forEach((doc) => {
            
            var receivedMessage = this.getMessage(doc);

            this.messages.push(receivedMessage);
            this.message = receivedMessage;
            
            if(this.message.currentDialog == "") {
              this.message.currentIntent = "";
              this.RetrieveDialog();
            }
          });
        });
  }

  private getMessage(doc: any) {
    var intentObject: IIntentObject;
    intentObject = doc.data();
    var receivedMessage: IMessageObject = {
      currentdsName: intentObject.nextds,
      currentDialog: intentObject.nextDialog,
      currentIntent: intentObject.intent,
      currentText: intentObject.response,
      being: intentObject.being,            
    };
    this.fallBack = intentObject.fallBack;
    return receivedMessage;
    
  }

  onKey(event: any) { // without type info
    console.log(event);
    if(event.keyCode == 13)
    this.CallBot();
  }

       

}

// Function to replace one element with another
// var str = '<a href="http://www.com">item to replace</a>'; //it can be anything
// var Obj = document.getElementById('TargetObject'); //any element to be fully replaced
// if(Obj.outerHTML) { //if outerHTML is supported
//     Obj.outerHTML=str; ///it's simple replacement of whole element with contents of str var
// }
// else { //if outerHTML is not supported, there is a weird but crossbrowsered trick
//     var tmpObj=document.createElement("div");
//     tmpObj.innerHTML='<!--THIS DATA SHOULD BE REPLACED-->';
//     ObjParent=Obj.parentNode; //Okey, element should be parented
//     ObjParent.replaceChild(tmpObj,Obj); //here we placing our temporary data instead of our target, so we can find it then and replace it into whatever we want to replace to
//     ObjParent.innerHTML=ObjParent.innerHTML.replace('<div><!--THIS DATA SHOULD BE REPLACED--></div>',str);
// }