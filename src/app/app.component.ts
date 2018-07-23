import { Component } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',    
  })
  export class AppComponent {
    constructor(private afAuth:AngularFireAuth) {}

  }