import { TestBed } from '@angular/core/testing';

import { UserPictureService } from './user-picture-service';

describe('UserPictureProfileService', () => {
  let service: UserPictureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPictureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
