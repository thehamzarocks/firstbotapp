import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { RouterModule, Router } from '@angular/router';


@Component({
  // selector: 'app-auth',
  // template: `
    
    
  // `,
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit{  

  loginState: string;

  constructor(public afAuth: AngularFireAuth, private db:AngularFirestore, private router:Router) {        
    this.loginState = "logged out";
  }
  login() {    
    this.loginState = "logging in";
    // this.loginState = "logged in";
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then((result) => {      
      var name = result.user.displayName;
      var email = result.user.email;
      console.log(email);
      var playersRef = this.db.collection("players").ref;
      var query = playersRef.where("email", "==", email);
      query.get().then((querySnapShot) => {
        if(querySnapShot.docs.length != 0) {
          console.log(this.loginState);
          this.router.navigateByUrl("/narratives");
        } else {
          //need to add to database
          playersRef.add({
            email: email,
            name: name,
            points: 0,
          })
          .then(() => {
            console.log(this.loginState);
            this.router.navigateByUrl("/narratives");
          })
          .catch((err) => {
            this.logout();
          });          

          }
        });
      });
    }    
  
  logout() {
    console.log("logging out");    
    this.loginState = "logged out";    
    this.afAuth.auth.signOut();
  }

  goToNarratives() {
    this.router.navigate(["/narratives"]);
  }

  
  

  ngOnInit():void {
    console.log("on auth");
  }
}