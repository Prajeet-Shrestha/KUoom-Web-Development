import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowdoesthisworkComponent } from './howdoesthiswork.component';

describe('HowdoesthisworkComponent', () => {
  let component: HowdoesthisworkComponent;
  let fixture: ComponentFixture<HowdoesthisworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowdoesthisworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowdoesthisworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
