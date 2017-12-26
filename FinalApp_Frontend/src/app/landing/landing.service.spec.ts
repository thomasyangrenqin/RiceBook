import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { LandingService } from './landing.service';

describe('LandingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      providers: [LandingService]
    });
  });

  it('should be created', inject([LandingService], (service: LandingService) => {
    expect(service).toBeTruthy();
  }));
});
