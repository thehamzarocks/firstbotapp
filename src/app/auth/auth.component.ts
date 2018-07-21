import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';


@Component({
  // selector: 'app-auth',
  // template: `
    
    
  // `,
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit{  

  constructor(public afAuth: AngularFireAuth, private db:AngularFirestore) {
  }
  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then((result) => {
      var name = result.user.displayName;      
      var playersRef = this.db.collection("players").ref;
      var query =playersRef.where("name", "==", name);
      query.get().then((querySnapShot) => {        
        if(querySnapShot.docs.length != 0) {
          return;
        } else {
          //need to add to database
          playersRef.add({
            name: name,
            points: 0,
          });

          }
        });
      });
    }    
  
  logout() {
    this.afAuth.auth.signOut();
  }

  
  

  ngOnInit():void {
    console.log("on auth");
  }
}