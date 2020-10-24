import { TestBed } from '@angular/core/testing';

import { DbfirestoreService } from './dbfirestore.service';

describe('DbfirestoreService', () => {
  let service: DbfirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbfirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
