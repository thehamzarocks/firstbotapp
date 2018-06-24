import { Component, OnInit } from '@angular/core';
import { FirstBotService } from '../../first-bot.service';
import { IIntentObject } from '../../intentobject';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/internal/Observable';


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
  
  

    this.messages = new Array<string>();
    this.currentDialog = "";
    this.currentIntent = "";
   }

  messages: string[];
  currentDialog: string = "";
  currentIntent: string = "";  
  inputText: string = "";

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
    var query = docRef.where("dialog", "==", "");
    query.get().then((querySnapShot) => {
        querySnapShot.forEach((doc) => {
          var intentObject: IIntentObject;
          intentObject = doc.data();          
          this.messages.push(intentObject.response);
          this.currentDialog = intentObject.nextDialog;          
        });
    });

  }

  CallBot() : void {
    this.messages.push(this.inputText);
    var input = this.inputText;
    this.inputText = "";
    this._firstbotservice.ReceiveFromWit(input)
      .subscribe(response => {
        console.log(response);
        var intent: string = response.entities.yes_no[0].value;
        this.currentIntent = intent;

        var docRef = this.database.collection('/DialogSequences').ref;
        var query = docRef.where("dialog", "==", this.currentDialog).where("intent", "==", this.currentIntent);
        query.get().then((querySnapShot) => {
          querySnapShot.forEach((doc) => {
            var intentObject: IIntentObject;
            intentObject = doc.data();          
            this.currentDialog = intentObject.nextDialog;
            this.messages.push(intentObject.response);
          });
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