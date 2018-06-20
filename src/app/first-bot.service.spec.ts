import { TestBed, inject } from '@angular/core/testing';

import { FirstBotService } from './first-bot.service';

describe('FirstBotService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirstBotService]
    });
  });

  it('should be created', inject([FirstBotService], (service: FirstBotService) => {
    expect(service).toBeTruthy();
  }));
});
