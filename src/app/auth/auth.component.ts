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
      var email = result.user.email;
      console.log(email);
      var playersRef = this.db.collection("players").ref;
      var query = playersRef.where("email", "==", email);
      query.get().then((querySnapShot) => {        
        if(querySnapShot.docs.length != 0) {
          return;
        } else {
          //need to add to database
          playersRef.add({
            email: email,
            name: name,
            points: 0,
          })
          .then(() => {

          })
          .catch((err) => {
            this.logout();
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