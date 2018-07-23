import { TestBed, async, inject } from '@angular/core/testing';

import { ChatdeactivateGuard } from './chatdeactivate.guard';

describe('ChatdeactivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatdeactivateGuard]
    });
  });

  it('should ...', inject([ChatdeactivateGuard], (guard: ChatdeactivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
