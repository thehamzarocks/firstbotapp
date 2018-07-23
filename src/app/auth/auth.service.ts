import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFireAction } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { auth } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    

  constructor(private afAuth:AngularFireAuth, private db:AngularFirestore) { }

  SignInUser() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then((result) => {
        this.CreateNewPlayer(result.user);
    });
  }

  CreateNewPlayer(user) {
      var name = user.displayName;
      var email = user.email;      
      var playersRef = this.db.collection("players").ref;
      var query = playersRef.where("email", "==", email);
      query.get().then((querySnapShot) => {
        if(querySnapShot.docs.length != 0) {          
        //   this.router.navigateByUrl("/narratives");
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
            this.LogOutUser();
          });          

          }
        });      
    }
    

    LogOutUser() {
        this.afAuth.auth.signOut();
    }
}
  

