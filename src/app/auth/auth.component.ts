import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './auth.service';


@Component({
  // selector: 'app-auth',
  // template: `
    
    
  // `,
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit{  

  loginState: string;

  constructor(public afAuth: AngularFireAuth, private db:AngularFirestore, private router:Router, private _authService:AuthService) {
    this.loginState = "logged out";
  }
  login() {    
    this._authService.SignInUser();
  }    
  
  logout() {
    this._authService.LogOutUser();
  }

  goToNarratives() {
    this.router.navigate(["/narratives"]);
  }

  
  

  ngOnInit():void {
    console.log("on auth");
  }
}