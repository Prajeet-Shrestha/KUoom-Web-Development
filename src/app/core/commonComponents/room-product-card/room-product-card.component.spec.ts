import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomProductCardComponent } from './room-product-card.component';

describe('RoomProductCardComponent', () => {
  let component: RoomProductCardComponent;
  let fixture: ComponentFixture<RoomProductCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomProductCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
