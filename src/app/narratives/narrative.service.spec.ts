import { TestBed, inject } from '@angular/core/testing';

import { NarrativeService } from './narrative.service';

describe('NarrativeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NarrativeService]
    });
  });

  it('should be created', inject([NarrativeService], (service: NarrativeService) => {
    expect(service).toBeTruthy();
  }));
});
