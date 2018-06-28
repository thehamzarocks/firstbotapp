import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { IIntentObject } from '../../intentobject';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/internal/Observable';
import { ReturnStatement } from '@angular/compiler';
import { IMessageObject } from '../../messageobject';
import { EMPTY } from 'rxjs';
import { ChatService } from './chat.service';
import { checkAndUpdateDirectiveDynamic } from '@angular/core/src/view/provider';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  

  user: Observable<firebase.User>;
  items: Observable<any[]>;

  messages: IMessageObject[]; //list of messages used for displaying in template
  message: IMessageObject; 
  inputText: string = "";

  fallback: string; //Used when the bot doesn't understand our input.

  database;

  inputDisabled: boolean;
  badConnection: boolean; //shows notification if connection to wit is unsuccesful, pops the sent message and sets it back to the input text

  addData() {
    // Add a new document in collection "cities"
    this.database.collection("dialogs").doc("15").set({
      type: "regular response",
      dsname: "fishing with red",
      dialog: "asked lake choice",
      intent: "golden lake",
      statename: "",
      statevalue: "",
      being: "Red",
      response: "We could use the money, but it won't be as fun :( Let's go.",
      nextds: "lake shop",
      nextdialog: "",
      autofetch: "true",
      fallback: ""
    })
    .then(function() {
      console.log("Document successfully written!");
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
  }

  constructor(private _firstbotservice:ChatService, db: AngularFirestore) {
    this.database = db;

    this.messages = new Array<IMessageObject>();

    this.message = <IMessageObject>{
      currentdsName: "initialize",
      currentDialog: "welcome",
      currentIntent: "",
      currentText: "",
      being: ""
    };   
    
    this.fallback = "I can't help you with that right now."
   }
  
  ngOnInit() {    

    this.inputDisabled = true;
    this.badConnection = false;
    
    this.RetrieveDialog();
  }

  //Called when the user hits enter
  CallBot() : void {

    if(this.inputText == "" || this.inputDisabled == true) {
      return;
    }
    
    this.sendMessage();

    var input = this.inputText;
    this.inputText = "";
    this.inputDisabled = true;
    
    this._firstbotservice.ReceiveFromWit(input)
      .subscribe(response => {
        this.badConnection = false;
        if(response.entities.yes_no == undefined) {
          this.HandleUnrecognizedResponse();
        }
        else {
          console.log(response.entities.yes_no);
          var intent: string = response.entities.yes_no[0].value;
          this.message.currentIntent = intent;
          this.RetrieveDialog();
        }
    },
      error => {
        console.log("Error getting reponse from wit");
        this.inputText = this.messages.pop().currentText;
        this.badConnection = true;
        this.inputDisabled = false;
      });
  }

  private sendMessage() {
    var sentMessage: IMessageObject = {
      currentdsName: "",
      currentDialog: "",
      currentIntent: "",
      currentText: this.inputText,
      being: "You",
    };
    this.messages.push(sentMessage);
  }

  //if the input is unrecognized by wit or the bot, use the previous dialog's fallback message
  private HandleUnrecognizedResponse() {
    var receivedMessage: IMessageObject = {
      currentdsName: this.message.currentdsName,
      currentDialog: this.message.currentDialog,
      currentIntent: this.message.currentIntent,
      currentText: this.fallback,
      being: this.message.being,
    };
    this.messages.push(receivedMessage);
    this.inputDisabled = false;
  }


  //connects to firestore, gets the object, and assigns it to a message object 
  RetrieveDialog(): void {
    console.log(this.message.currentdsName, this.message.currentDialog, this.message.currentIntent);
    var docRef = this.database.collection('/dialogs').ref;
    var query = docRef.where("dsname", "==", this.message.currentdsName).where("dialog", "==", this.message.currentDialog).where("intent", "==", this.message.currentIntent);
    query.get().then((querySnapShot) => {
      if(querySnapShot.docs.length == 0) {
        this.HandleUnrecognizedResponse();
      }
       
      else {
        var doc = querySnapShot.docs[0];
        var receivedMessage = this.getMessage(doc);

        this.messages.push(receivedMessage);
        this.message = receivedMessage;
        
        if(this.message.currentDialog == "") {
          this.message.currentIntent = "";
          this.RetrieveDialog();
        }
        else {
          this.inputDisabled = false;
        }
      }
      
    });
  }

  private getMessage(doc: any) {
    var intentObject: IIntentObject;
    intentObject = doc.data();
    var receivedMessage: IMessageObject = {
      currentdsName: intentObject.nextds,
      currentDialog: intentObject.nextdialog,
      currentIntent: intentObject.intent,
      currentText: intentObject.response,
      being: intentObject.being,            
    };
    this.fallback = intentObject.fallback;
    return receivedMessage;    
  }

  onKey(event: any) { // without type info    
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