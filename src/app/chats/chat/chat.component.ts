import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { FirstBotService } from '../../first-bot.service';
import { IIntentObject } from '../../intentobject';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/internal/Observable';
import { ReturnStatement } from '@angular/compiler';


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

    var docRef = db.collection('/DialogSequences').ref;
    var query = docRef.where("dialog", "==", "");
    query.get().then((querySnapShot) => {
        querySnapShot.forEach((doc) => {
          console.log(`${doc.id} => ${doc.data().response}`);
        });
    });
  
    
  

    this.messages = new Array<IIntentObject>();

    this.intentObject = <IIntentObject>{
      _id: "",
      dsname: "dream enigma start",
      dialog: "",
      intent: "",
      response: "",
      nextDialog: "",
      nextds: "",
      being: ""
    };
    this.intentObject.dialog = "";
    this.intentObject.dsname = "";
    this.intentObject.intent = "";    

    
   }

  messages: IIntentObject[];
  inputText: string = "";
  intentObject: IIntentObject;

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
          this.intentObject = doc.data();
          this.intentObject.dialog = this.intentObject.nextDialog;
          this.intentObject.dsname = this.intentObject.nextds;
          console.log(this.intentObject.dsname, this.intentObject.dialog, this.intentObject.intent);
          this.messages.push(this.intentObject);          
        });
    });

  }

  CallBot() : void {
    var sentMessage: IIntentObject = {
      _id: "",
      dsname: "",
      dialog: "",
      intent: "",
      response: this.inputText,
      nextDialog: "",
      nextds: "",
      being: "You"
    }    
    
    this.messages.push(sentMessage);
    var input = this.inputText;
    this.inputText = "";
    this._firstbotservice.ReceiveFromWit(input)
      .subscribe(response => {        
        var intent: string = response.entities.yes_no[0].value;
        this.intentObject.intent = intent;
        this.RetrieveDialog();
    });
  }

  RetrieveDialog(): void {
    console.log(this.intentObject.dsname, this.intentObject.dialog, this.intentObject.intent);
    var docRef = this.database.collection('/DialogSequences').ref;
        var query = docRef.where("dsname", "==", this.intentObject.dsname).where("dialog", "==", this.intentObject.dialog).where("intent", "==", this.intentObject.intent);
        query.get().then((querySnapShot) => {
          querySnapShot.forEach((doc) => {
            
            this.intentObject = doc.data();
            this.intentObject.dialog = this.intentObject.nextDialog;
            this.intentObject.dsname = this.intentObject.nextds;
            this.messages.push(this.intentObject);

            if(this.intentObject.dialog == "") {
              this.intentObject.intent = "";
              this.RetrieveDialog();
            }
          });
        });
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