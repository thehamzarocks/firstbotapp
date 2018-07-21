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
import { ISelectorObject } from '../../selectorobject';


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
  selectors: ISelectorObject[];
  inputText: string = "";

  fallback: string; //Used when the bot doesn't understand our input.

  database;

  displayInfo: boolean; //switch between chat and info
  gold: number;
  redRelationship: number;
  blueRelationship: number;
  

  inputDisabled: boolean;
  badConnection: boolean; //shows notification if connection to wit is unsuccesful, pops the sent message and sets it back to the input text

  addData() {
    // Add a new document in collection "cities"
    this.database.collection("dialogs").doc("76").set({
      type: "regular response",
      dsname: "red ds",
      dialog: "red asked what to do about green",
      intent: "catch",
      statename: "",

      // operation: "set",
      // op1: "Green Open DS",
      // value: "green ds",

      being: "Red",
      response: "",
      nextds: "",
      nextdialog: "",
      statevalue: "",
      autofetch: "false",
      fallback: ""
    })
    .then(function() {
      console.log("Document successfully written!");
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
  }

  constructor(private _firstbotservice:ChatService, db: AngularFirestore, public afAuth: AngularFireAuth) {
    this.database = db;

    this.messages = new Array<IMessageObject>();
    this.selectors = [{
      statename: '',
      statevalue: '',
      intent: '',
      nextid: 0,
    }];

    this.message = <IMessageObject>{
      currentdsName: "storm",
      currentDialog: "",
      currentIntent: "",
      currentText: "",
      currentStateValue: "",
      being: "",
      autofetch: true,
    };   
    
    this.fallback = "I can't help you with that right now."
   }
  
  ngOnInit() {
    
    this.displayInfo = false;
    this.inputDisabled = true;
    this.badConnection = false;

    // var docRef = this.database.collection("/states").doc("Gold").set({
    //   statevalue: 500
    // });

    // var docRef = this.database.collection("/states").doc("Red Relationship").set({
    //   statevalue: 50
    // });
    // var docRef = this.database.collection("/states").doc("Blue Relationship").set({
    //   statevalue: 50
    // });
    // var docRef = this.database.collection("/states").doc("Green Relationship").set({
    //   statevalue: 50
    // });

    // var docRef = this.database.collection("/states").doc("Red Open DS").set({
    //   statevalue: ""
    // });
    // var docRef = this.database.collection("/states").doc("Blue Open DS").set({
    //   statevalue: ""
    // });
    // var docRef = this.database.collection("/states").doc("Green Open DS").set({
    //   statevalue: ""
    // });

    
    // this.UpdateCharacterInfo();
    
    this.GetId('');
  }

  //Called when the user hits enter
  CallBot() : void {

    if(this.inputText == "" || this.inputDisabled == true || this.displayInfo == true) {
      return;
    }
    
    this.sendMessage();

    var input = this.inputText;
    this.inputText = "";
    this.inputDisabled = true;
    
    // this._firstbotservice.ReceiveFromWit(input)
    //   .subscribe(response => {
    //     this.badConnection = false;
    //     if(response.entities.yes_no == undefined) {
    //       this.HandleUnrecognizedResponse();
    //     }
    //     else {
    //       console.log(response.entities.yes_no);
    //       var intent: string = response.entities.yes_no[0].value;
    //       this.message.currentIntent = intent;
    //       this.GetId();
    //     }
    // },
    //   error => {
    //     console.log("Error getting reponse from wit");
    //     this.inputText = this.messages.pop().currentText;
    //     this.badConnection = true;
    //     this.inputDisabled = false;
    //   });

    this.GetId(input);
    
  }

  private sendMessage() {

    //when the user enters anything, make it into a message object and push it to the messages array
    var sentMessage: IMessageObject = {
      currentdsName: "",
      currentDialog: "",
      currentIntent: "",
      currentStateValue: "",
      currentText: this.inputText,
      being: "You",
      autofetch: false,
    };
    this.messages.push(sentMessage);
  }

  //if the input is unrecognized by wit or the bot, use the previous dialog's fallback message
  private HandleUnrecognizedResponse() {
    var receivedMessage: IMessageObject = {
      currentdsName: this.message.currentdsName,
      currentDialog: this.message.currentDialog,
      currentIntent: this.message.currentIntent,
      currentStateValue: this.message.currentStateValue,
      currentText: this.fallback,
      being: this.message.being,
      autofetch: this.message.autofetch,
    };
    this.messages.push(receivedMessage);
    this.inputDisabled = false;
  }


  //connects to firestore, gets the object, and assigns it to a message object 
  RetrieveDialog(id: number): void {    
    console.log(id);
    console.log(this.message.currentdsName, this.message.currentIntent);
    var docRef = this.database.collection('/dialogsequences').ref;
    var query = docRef.where("dsname", "==", this.message.currentdsName).where("id", "==", id);
    query.get().then((querySnapShot) => {
      if(querySnapShot.docs.length == 0) {
        this.HandleUnrecognizedResponse();
      }
       
      else {
        var doc = querySnapShot.docs[0];        
        var dialog: IIntentObject = doc.data();        
        if(dialog.type == "rr") {
          this.HandleRegularResponse(dialog);
        }

        else if(dialog.type == "cn") {
          console.log("handling compute node");
          this.HandleComputeNode(dialog);
        }

        else if(dialog.type == "en") {
          console.log(dialog.nextds);
          this.message.currentdsName = dialog.nextds;          
        }
        
      }
      
    });
  }

  private AutoFetch() {
    console.log(this.message.autofetch);
    if (this.message.autofetch == true) {
      setTimeout(()=>this.GetId(''), 2000);
      
    }
    else {
      this.inputDisabled = false;
    }
  }

  private HandleRegularResponse(dialog: IIntentObject) {    
    var receivedMessage = this.getMessage(dialog);
    //we need the state value to select the next dialog
    if(dialog.nextstatename != null) {
      var docRef = this.database.collection('/states').doc(dialog.nextstatename).ref;
      docRef.get().then((doc) => {
        receivedMessage.currentStateValue = doc.data().statevalue;
        this.messages.push(receivedMessage);
        this.message = receivedMessage;

        this.AutoFetch();
      });
    }
    else {
      this.messages.push(receivedMessage);
      this.message = receivedMessage;

      this.AutoFetch();
    }
    
  }

  private getMessage(dialog: IIntentObject) {
    console.log("getting message");
    var intentObject: IIntentObject;
    intentObject = dialog;

    //we use these selectors to query for the next dialog
    var receivedMessage: IMessageObject = {
      currentdsName: intentObject.nextds,
      currentDialog: intentObject.nextdialog,
      currentIntent: "",
      currentStateValue: "",
      currentText: intentObject.response,
      being: intentObject.being,
      autofetch: intentObject.autofetch,            
    };
    console.log(receivedMessage);

    this.selectors = intentObject.selectors;
    console.log(this.selectors);
    this.fallback = intentObject.fallback;
    return receivedMessage;
  }


  private HandleComputeNode(dialog: IIntentObject) {
    var intentobject: IIntentObject = dialog;

    if(intentobject.operation == "change") {
      var docRef = this.database.collection('/states').doc(intentobject.op1).ref;
      docRef.get().then((doc) => {
        if(doc.exists == false) {
          this.HandleUnrecognizedResponse();
        }
        else {
          var stateobject: IIntentObject = doc.data();
          var currentValue: number = parseInt(stateobject.statevalue, 10);
          //currentValue = currentValue + intentobject.op2;
          docRef.set({
            statevalue: currentValue
          });
        }
        
        this.UpdateCharacterInfo();
      });
    }

    if(intentobject.operation == "set") {
      console.log("setting");  
      var docRef = this.database.collection("/states").doc(intentobject.op1).set({
        statevalue: intentobject.op2
      });
    }

    
    var receivedMessage = this.getMessage(intentobject);
    this.message = receivedMessage;
    this.AutoFetch();
    

    
  }

  UpdateCharacterInfo() {
    var docRef = this.database.collection("/states").doc("Gold").ref;
      docRef.get().then((doc)=> {
        this.gold = doc.data().statevalue;
      });
    var docRef = this.database.collection("/states").doc("Red Relationship").ref;
      docRef.get().then((doc)=> {
        this.redRelationship = doc.data().statevalue;
      });
      var docRef = this.database.collection("/states").doc("Blue Relationship").ref;
      docRef.get().then((doc)=> {
        this.blueRelationship = doc.data().statevalue;
      });
  }

  ToggleInfo() {    
    this.displayInfo = !this.displayInfo;
  }
    
  

  onKey(event: any) { // without type info    
    if(event.keyCode == 13)
    this.CallBot();
  }

  startDS(character: String) {
    var characterdsSelector: String = character + " Open DS"
    console.log(characterdsSelector)
    var docRef = this.database.collection("/states").doc(characterdsSelector).ref;
      docRef.get().then((doc)=> {
        if(doc.data().statevalue == "") {
          //need to put up a notification saying can't open chat with the character right now
          return;
        }
        this.message.currentdsName = doc.data().statevalue;
        this.message.currentDialog = "";
        this.message.currentIntent = "";
        this.message.currentStateValue = "";
        this.message.currentText = "";

        this.GetId('');
      });
  }

  GetId(input:string): void {
    console.log("getting id");
    this.GetIdUtil(0, input);
  }

  GetIdUtil(index: number, input: string) {
    var selector: ISelectorObject = this.selectors[index];
    if(selector == null) {
      this.HandleUnrecognizedResponse();
      return;
    }
    if(selector.statename != '') {
      var docRef = this.database.collection("/states").doc(selector.statename).ref;
      docRef.get().then((doc)=> {
        var statevalue = doc.data().statevalue;
        if((statevalue == selector.statevalue) && (this.message.currentIntent == selector.intent)) {
          this.RetrieveDialog(selector.nextid);
        }
        else {
          this.GetIdUtil(index+1, input);
        }
      });
    }  

    else if(selector.statename == '' && this.IntentMatches(input, selector.intent)) {
      this.RetrieveDialog(selector.nextid);
    }
    else {
      this.GetIdUtil(index+1, input);
    }
  }

  IntentMatches(input:string, selectorIntent:string): boolean {
    return input.toLowerCase().includes(selectorIntent);
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