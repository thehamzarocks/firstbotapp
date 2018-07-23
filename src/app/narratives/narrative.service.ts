import { Injectable } from '@angular/core';
import { INarrativeObject } from './narrativeobject';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAction } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class NarrativeService {

  narratives: INarrativeObject[] =  [
    {
      name: "The Storm",
      requiredPoints: 0,
      description: "A stormy day. Perfect beginning to the perfect adventure.",
      dsname: "storm",
    },
    {
      name: "Explosions",
      requiredPoints: 130,
      description: "Nothing like a few good explosions to liven up your day.",
      dsname: "explosion"
    },
  ];

  playerPoints: number;
  allowedNarratives: INarrativeObject[];
  
  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) { 
    this.allowedNarratives = new Array<INarrativeObject>();
  }
  
  SetAllowedNarratives() {
    this.allowedNarratives = new Array<INarrativeObject>();
    this.afAuth.user.subscribe((user) => {
      this.db.collection("players").ref.where("email", "==" , user.email).get()
      .then((querySnapshot) => {
        if(querySnapshot.docs.length == 0) {
          console.log("error getting player");
        }
        var points = querySnapshot.docs[0].data().points;
        this.playerPoints = points;
        for(var i=0; i<this.narratives.length; i++) {
          if(this.narratives[i].requiredPoints <= points) {
            this.allowedNarratives.push(this.narratives[i]);
          }
        }
      })
    });
  }
}
