// import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
// import { IIntentObject } from '../../intentobject';
// import { AngularFirestore } from 'angularfire2/firestore';
// import { AngularFireDatabase } from 'angularfire2/database';
// import { AngularFireAuth } from 'angularfire2/auth';
// import * as firebase from 'firebase/app';
// import { Observable } from 'rxjs/internal/Observable';
// import { ReturnStatement } from '@angular/compiler';
// import { IMessageObject } from '../../messageobject';
// import { EMPTY } from 'rxjs';
// import { ChatService } from './chat.service';
// import { checkAndUpdateDirectiveDynamic } from '@angular/core/src/view/provider';
// import { ISelectorObject } from 'src/app/selectorobject';


// @Component({
//   selector: 'app-chat',
//   templateUrl: './chat.component.html',
//   styleUrls: ['./chat.component.css']
// })
// export class ChatComponent implements OnInit {
  

//   user: Observable<firebase.User>;
//   items: Observable<any[]>;

//   messages: IMessageObject[]; //list of messages used for displaying in template
//   message: IMessageObject; 
//   selectors: ISelectorObject[];
//   inputText: string = "";

//   fallback: string; //Used when the bot doesn't understand our input.

//   database;

//   displayInfo: boolean; //switch between chat and info
//   gold: number;
//   redRelationship: number;
//   blueRelationship: number;
  

//   inputDisabled: boolean;
//   badConnection: boolean; //shows notification if connection to wit is unsuccesful, pops the sent message and sets it back to the input text

//   addData() {
//     // Add a new document in collection "cities"
//     this.database.collection("dialogs").doc("76").set({
//       type: "regular response",
//       dsname: "red ds",
//       dialog: "red asked what to do about green",
//       intent: "catch",
//       statename: "",

//       // operation: "set",
//       // op1: "Green Open DS",
//       // value: "green ds",

//       being: "Red",
//       response: "",
//       nextds: "",
//       nextdialog: "",
//       statevalue: "",
//       autofetch: "false",
//       fallback: ""
//     })
//     .then(function() {
//       console.log("Document successfully written!");
//     })
//     .catch(function(error) {
//       console.error("Error writing document: ", error);
//     });
//   }

//   constructor(private _firstbotservice:ChatService, db: AngularFirestore) {
//     this.database = db;

//     this.messages = new Array<IMessageObject>();

//     this.message = <IMessageObject>{
//       currentdsName: "initialize",
//       currentDialog: "welcome",
//       currentIntent: "",
//       currentText: "",
//       currentStateValue: "",
//       being: "",
//       autofetch: "true"
//     };   
    
//     this.fallback = "I can't help you with that right now."
//    }
  
//   ngOnInit() {    

//     this.displayInfo = false;
//     this.inputDisabled = true;
//     this.badConnection = false;

//     var docRef = this.database.collection("/states").doc("Gold").set({
//       statevalue: 500
//     });

//     var docRef = this.database.collection("/states").doc("Red Relationship").set({
//       statevalue: 50
//     });
//     var docRef = this.database.collection("/states").doc("Blue Relationship").set({
//       statevalue: 50
//     });
//     var docRef = this.database.collection("/states").doc("Green Relationship").set({
//       statevalue: 50
//     });

//     var docRef = this.database.collection("/states").doc("Red Open DS").set({
//       statevalue: ""
//     });
//     var docRef = this.database.collection("/states").doc("Blue Open DS").set({
//       statevalue: ""
//     });
//     var docRef = this.database.collection("/states").doc("Green Open DS").set({
//       statevalue: ""
//     });

    
//     this.UpdateCharacterInfo();
    
//     this.RetrieveDialog();
//   }

//   //Called when the user hits enter
//   CallBot() : void {

//     if(this.inputText == "" || this.inputDisabled == true || this.displayInfo == true) {
//       return;
//     }
    
//     this.sendMessage();

//     var input = this.inputText;
//     this.inputText = "";
//     this.inputDisabled = true;
    
//     this._firstbotservice.ReceiveFromWit(input)
//       .subscribe(response => {
//         this.badConnection = false;
//         if(response.entities.yes_no == undefined) {
//           this.HandleUnrecognizedResponse();
//         }
//         else {
//           console.log(response.entities.yes_no);
//           var intent: string = response.entities.yes_no[0].value;
//           this.message.currentIntent = intent;
//           this.RetrieveDialog();
//         }
//     },
//       error => {
//         console.log("Error getting reponse from wit");
//         this.inputText = this.messages.pop().currentText;
//         this.badConnection = true;
//         this.inputDisabled = false;
//       });
//   }

//   private sendMessage() {

//     //when the user enters anything, make it into a message object and push it to the messages array
//     var sentMessage: IMessageObject = {
//       currentdsName: "",
//       currentDialog: "",
//       currentIntent: "",
//       currentStateValue: "",
//       currentText: this.inputText,
//       being: "You",
//       autofetch: "false"
//     };
//     this.messages.push(sentMessage);
//   }

//   //if the input is unrecognized by wit or the bot, use the previous dialog's fallback message
//   private HandleUnrecognizedResponse() {
//     var receivedMessage: IMessageObject = {
//       currentdsName: this.message.currentdsName,
//       currentDialog: this.message.currentDialog,
//       currentIntent: this.message.currentIntent,
//       currentStateValue: this.message.currentStateValue,
//       currentText: this.fallback,
//       being: this.message.being,
//       autofetch: this.message.autofetch,
//     };
//     this.messages.push(receivedMessage);
//     this.inputDisabled = false;
//   }


//   //connects to firestore, gets the object, and assigns it to a message object 
//   RetrieveDialog(): void {
//     console.log(this.message.currentdsName, this.message.currentDialog, this.message.currentIntent, this.message.currentStateValue);
//     var docRef = this.database.collection('/dialogs').ref;
//     var query = docRef.where("dsname", "==", this.message.currentdsName).where("dialog", "==", this.message.currentDialog).where("intent", "==", this.message.currentIntent)
//                                 .where("statevalue", "==", this.message.currentStateValue);
//     query.get().then((querySnapShot) => {
//       if(querySnapShot.docs.length == 0) {
//         this.HandleUnrecognizedResponse();
//       }
       
//       else {
//         var doc = querySnapShot.docs[0];
//         var dialog: IIntentObject = doc.data();
//         if(dialog.type == "regular response") {
//           this.HandleRegularResponse(dialog);  
//         }

//         else if(dialog.type == "compute node") {
//           this.HandleComputeNode(dialog);
//         }       
        
//       }
      
//     });
//   }

//   private AutoFetch() {
//     if (this.message.autofetch == "true") {
//       this.RetrieveDialog();
//     }
//     else {
//       this.inputDisabled = false;
//     }
//   }

//   private HandleRegularResponse(dialog: IIntentObject) {    
//     var receivedMessage = this.getMessage(dialog);
//     //we need the state value to select the next dialog
//     if(dialog.nextstatename != null) {
//       var docRef = this.database.collection('/states').doc(dialog.nextstatename).ref;
//       docRef.get().then((doc) => {
//         receivedMessage.currentStateValue = doc.data().statevalue;
//         this.messages.push(receivedMessage);
//         this.message = receivedMessage;

//         this.AutoFetch();
//       });
//     }
//     else {
//       this.messages.push(receivedMessage);
//       this.message = receivedMessage;

//       this.AutoFetch();
//     }
    
//   }

//   private getMessage(dialog: IIntentObject) {
//     var intentObject: IIntentObject;
//     intentObject = dialog;

//     //we use these selectors to query for the next dialog
//     var receivedMessage: IMessageObject = {
//       currentdsName: intentObject.nextds,
//       currentDialog: intentObject.nextdialog,
//       currentIntent: "",
//       currentStateValue: "",
//       currentText: intentObject.response,
//       being: intentObject.being,
//       autofetch: intentObject.autofetch,
//     };

//     this.fallback = intentObject.fallback;
//     return receivedMessage;
//   }


//   private HandleComputeNode(dialog: IIntentObject) {
//     var intentobject: IIntentObject = dialog;

//     if(intentobject.operation == "change") {
//       var docRef = this.database.collection('/states').doc(intentobject.op1).ref;
//       docRef.get().then((doc) => {
//         if(doc.exists == false) {
//           this.HandleUnrecognizedResponse();
//         }
//         else {
//           var stateobject: IIntentObject = doc.data();
//           var currentValue: number = parseInt(stateobject.statevalue, 10);
//           currentValue = currentValue + intentobject.value;
//           docRef.set({
//             statevalue: currentValue
//           });
//         }
        
//         this.UpdateCharacterInfo();
//       });
//     }

//     if(intentobject.operation == "set") {      
//       var docRef = this.database.collection("/states").doc(intentobject.op1).set({
//         statevalue: intentobject.value
//       });
//     }

    
//     var receivedMessage = this.getMessage(intentobject);
//     this.message = receivedMessage;
//     this.AutoFetch();
    

    
//   }

//   UpdateCharacterInfo() {
//     var docRef = this.database.collection("/states").doc("Gold").ref;
//       docRef.get().then((doc)=> {
//         this.gold = doc.data().statevalue;
//       });
//     var docRef = this.database.collection("/states").doc("Red Relationship").ref;
//       docRef.get().then((doc)=> {
//         this.redRelationship = doc.data().statevalue;
//       });
//       var docRef = this.database.collection("/states").doc("Blue Relationship").ref;
//       docRef.get().then((doc)=> {
//         this.blueRelationship = doc.data().statevalue;
//       });
//   }

//   ToggleInfo() {    
//     this.displayInfo = !this.displayInfo;
//   }
    
  

//   onKey(event: any) { // without type info    
//     if(event.keyCode == 13)
//     this.CallBot();
//   }

//   startDS(character: String) {
//     var characterdsSelector: String = character + " Open DS"
//     console.log(characterdsSelector)
//     var docRef = this.database.collection("/states").doc(characterdsSelector).ref;
//       docRef.get().then((doc)=> {
//         if(doc.data().statevalue == "") {
//           //need to put up a notification saying can't open chat with the character right now
//           return;
//         }
//         this.message.currentdsName = doc.data().statevalue;
//         this.message.currentDialog = "";
//         this.message.currentIntent = "";
//         this.message.currentStateValue = "";
//         this.message.currentText = "";

//         this.RetrieveDialog();
//       });
//   }
       

// }

// // Function to replace one element with another
// // var str = '<a href="http://www.com">item to replace</a>'; //it can be anything
// // var Obj = document.getElementById('TargetObject'); //any element to be fully replaced
// // if(Obj.outerHTML) { //if outerHTML is supported
// //     Obj.outerHTML=str; ///it's simple replacement of whole element with contents of str var
// // }
// // else { //if outerHTML is not supported, there is a weird but crossbrowsered trick
// //     var tmpObj=document.createElement("div");
// //     tmpObj.innerHTML='<!--THIS DATA SHOULD BE REPLACED-->';
// //     ObjParent=Obj.parentNode; //Okey, element should be parented
// //     ObjParent.replaceChild(tmpObj,Obj); //here we placing our temporary data instead of our target, so we can find it then and replace it into whatever we want to replace to
// //     ObjParent.innerHTML=ObjParent.innerHTML.replace('<div><!--THIS DATA SHOULD BE REPLACED--></div>',str);
// // }



//{ "dsname": "explosion", "dialogs": [ { "type": "rr", "being": "Narrator", "response": "You wake up again, this time to faint beeps coming from somewhere in your house. You realize it must be the gizmo you found. You try to recollect its whereabouts.", "fallback": "It's not there.", "operation": "", "op1": "", "op2": "", "nextds": "", "selectors": [ { "statename": "", "statevalue": "", "intent": "chimney", "nextid": 1 } ] }, { "type": "rr", "being": "You", "response": "I remember it falling into the chimney. Let me check it out.", "fallback": "", "operation": "", "op1": "", "op2": "", "nextds": "", "selectors": [ { "statename": "", "statevalue": "", "intent": "", "nextid": 2 } ] }, { "type": "rr", "being": "Narrator", "response": "You find the thing stuck high up in the chimney. You try to climb and retrieve it, only to become stuck yourself.", "fallback": "", "operation": "", "op1": "", "op2": "", "nextds": "", "selectors": [ { "statename": "", "statevalue": "", "intent": "", "nextid": 3 } ] }, { "type": "rr", "being": "You", "response": "Ugh. Now I'm stuck too. It's not much higher. Maybe I can reach it from here...", "fallback": "", "operation": "", "op1": "", "op2": "", "nextds": "", "selectors": [ { "statename": "", "statevalue": "", "intent": "", "nextid": 4 } ] }, { "type": "rr", "being": "Narrator", "response": "Suddenly, the beeps get louder and the thing explodes above you, covering you with soot. Startled, you come crashing down on to the fireplace.", "fallback": "", "operation": "", "op1": "", "op2": "", "nextds": "", "selectors": [ { "statename": "", "statevalue": "", "intent": "", "nextid": 5 } ] }, { "type": "rr", "being": "Narrator", "response": "You curse and stand up. Something falls on your head.", "fallback": "", "operation": "", "op1": "", "op2": "", "nextds": "", "selectors": [ { "statename": "", "statevalue": "", "intent": "", "nextid": 6 } ] }, { "type": "rr", "being": "You", "response": "What?! Didn't this thing just blow up? This is getting too weird. I'm getting rid of it.", "fallback": "", "operation": "", "op1": "", "op2": "", "nextds": "", "selectors": [ { "statename": "", "statevalue": "", "intent": "", "nextid": 7 } ] }, { "type": "rr", "being": "Narrator", "response": "As you prepare to toss it out your window in rage, the screen lights up. It says take me home.", "fallback": "Take me home... What does that mean?", "operation": "", "op1": "", "op2": "", "nextds": "", "selectors": [ { "statename": "", "statevalue": "", "intent": "flush", "nextid": 8 }, { "statename": "", "statevalue": "", "intent": "tank", "nextid": 8 }, { "statename": "", "statevalue": "", "intent": "cistern", "nextid": 8 } ] }, { "type": "rr", "being": "You", "response": "I found it in the cistern. Maybe that's what it means by home.", "fallback": "", "operation": "", "op1": "", "op2": "", "nextds": "", "selectors": [ { "statename": "", "statevalue": "", "intent": "", "nextid": 9 } ] }, { "type": "rr", "being": "Narrator", "response": "You drop it in the flush water, intending to forget about it forever.", "fallback": "", "operation": "", "op1": "", "op2": "", "nextds": "", "selectors": [ { "statename": "", "statevalue": "", "intent": "", "nextid": 10 } ] }, { "type": "rr", "being": "Narrator", "response": "You bask in the silence for a few moments. Then, out of nowhere, it explodes again showering you with flush water.", "fallback": "", "operation": "", "op1": "", "op2": "", "nextds": "", "selectors": [ { "statename": "", "statevalue": "", "intent": "", "nextid": 11 } ] }, { "type": "rr", "being": "You", "response": "Arrgh. I'm soaked! I don't care what it says. I'm getting rid of it.", "fallback": "", "operation": "", "op1": "", "op2": "", "nextds": "", "selectors": [ { "statename": "", "statevalue": "", "intent": "", "nextid": 12 } ] }, { "type": "rr", "being": "Narrator", "response": "The screen lights up again. You take a cursory glance. It reads \"Free Pizza\", followed by a number.", "fallback": "", "operation": "", "op1": "", "op2": "", "nextds": "", "selectors": [ { "statename": "", "statevalue": "", "intent": "", "nextid": 13 }, { "statename": "", "statevalue": "", "intent": "", "nextid": 13 }, { "statename": "", "statevalue": "", "intent": "", "nextid": 13 }, { "statename": "", "statevalue": "", "intent": "", "nextid": 13 } ] }, { "type": "rr", "being": "You", "response": "Wow. Free pizza. I could definitely use some.", "fallback": "", "operation": "", "op1": "", "op2": "", "nextds": "", "selectors": [ { "statename": "", "statevalue": "", "intent": "phone", "nextid": 14 }, { "statename": "", "statevalue": "", "intent": "call", "nextid": 14 }, { "statename": "", "statevalue": "", "intent": "dial", "nextid": 14 }, { "statename": "", "statevalue": "", "intent": "order", "nextid": 14 } ] }, { "type": "rr", "being": "Narrator", "response": "You know this is a bad idea. But hunger and temptation get the best of you and you dial the number, half expecting the thing to explode again.", "fallback": "", "operation": "", "op1": "", "op2": "", "nextds": "", "selectors": [ { "statename": "", "statevalue": "", "intent": "", "nextid": 15 } ] }, { "type": "rr", "being": "Pizza Guy", "response": "Hello,you've reached Ben's Homemade Pizza. How may I help you?", "fallback": "", "operation": "", "op1": "", "op2": "", "nextds": "", "selectors": [ { "statename": "", "statevalue": "", "intent": "", "nextid": 16 } ] }, { "type": "rr", "being": "Narrator", "response": "You order a large with all the toppings. A delivery guy hands over the box and leaves. It feels light.", "fallback": "", "operation": "", "op1": "", "op2": "", "nextds": "", "selectors": [ { "statename": "", "statevalue": "", "intent": "", "nextid": 17 } ] }, { "type": "rr", "being": "You", "response": "Huh. This thing looks ll dry and shrivelled up. Maybe I can do somehing about it.", "fallback": "What else could I use to make it right again?", "operation": "", "op1": "", "op2": "", "nextds": "", "selectors": [ { "statename": "", "statevalue": "", "intent": "flush", "nextid": 19 }, { "statename": "", "statevalue": "", "intent": "cistern", "nextid": 19 }, { "statename": "", "statevalue": "", "intent": "tank", "nextid": 19 }, { "statename": "", "statevalue": "", "intent": "water", "nextid": 18 }, { "statename": "", "statevalue": "", "intent": "liquid", "nextid": 18 } ] }, { "type": "rr", "being": "You", "response": "Hmm. Regular water doesn't seem to work", "fallback": "What else could I use to make it right again?", "operation": "", "op1": "", "op2": "", "nextds": "", "selectors": [ { "statename": "", "statevalue": "", "intent": "flush", "nextid": 19 }, { "statename": "", "statevalue": "", "intent": "tank", "nextid": 19 }, { "statename": "", "statevalue": "", "intent": "cistern", "nextid": 19 } ] }, { "type": "rr", "being": "You", "response": "Ugh. Nothing else seems to work. I'll try out what's left of this flush water. I must be going crazy.", "fallback": "", "operation": "", "op1": "", "op2": "", "nextds": "", "selectors": [ { "statename": "", "statevalue": "", "intent": "", "nextid": 20 } ] }, { "type": "rr", "being": "Narrator", "response": "Hesitantly, you dunk a tiny slice into the water. Much to your astonishment, it instantly grows into a nice big slice. Your initial feelings of disgust are eroded as delecious aromas waft into your nose. You eat the remaining slices too, and go to bed, stuffed. You forget about the gizmo left on your bedstand which explodes and wakes you up with a jolt. After some initial cursing, you toss it out the window and go back to sleep.", "fallback": "", "operation": "", "op1": "", "op2": "", "nextds": "", "selectors": [ { "statename": "", "statevalue": "", "intent": "", "nextid": 21 } ] }, { "type": "en", "being": "", "response": "", "fallback": "", "operation": "", "op1": "", "op2": "", "nextds": "end explosion", "selectors": [ { "statename": "", "statevalue": "", "intent": "", "nextid": 0 } ] } ] }