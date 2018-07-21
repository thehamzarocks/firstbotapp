import { Component, OnInit } from '@angular/core';
import { IPlayer } from './playerobject';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-highscore',
  templateUrl: './highscore.component.html',
  styleUrls: ['./highscore.component.css']
})
export class HighscoreComponent implements OnInit {

  players: IPlayer[];

  constructor(private db:AngularFirestore) { }

  ngOnInit() {
    this.players = new Array<IPlayer>();

    this.db.collection("players").ref.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.players.push({
          playerName: doc.data().name,
          points: doc.data().points,
        });        
      });
      this.players.sort((player1,player2) => {
        return -(player1.points - player2.points);
      })
      });
  }

}
