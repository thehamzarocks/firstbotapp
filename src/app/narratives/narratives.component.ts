import { Component, OnInit } from '@angular/core';
import { NarrativeService } from './narrative.service';

@Component({
  selector: 'app-narratives',
  templateUrl: './narratives.component.html',
  styleUrls: ['./narratives.component.css']
})
export class NarrativesComponent implements OnInit {

  

  constructor(private narrativeService: NarrativeService) { }

  ngOnInit() {    
    this.narrativeService.SetAllowedNarratives();
  }

}
