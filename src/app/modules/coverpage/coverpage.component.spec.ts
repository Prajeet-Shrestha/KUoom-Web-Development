import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverpageComponent } from './coverpage.component';

describe('CoverpageComponent', () => {
  let component: CoverpageComponent;
  let fixture: ComponentFixture<CoverpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
