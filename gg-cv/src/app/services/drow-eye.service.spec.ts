import { TestBed, inject } from '@angular/core/testing';

import { DrowEyeService } from './drow-eye.service';

describe('DrowEyeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrowEyeService]
    });
  });

  it('should be created', inject([DrowEyeService], (service: DrowEyeService) => {
    expect(service).toBeTruthy();
  }));
});
