import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductprofileComponent } from './productprofile.component';

describe('ProductprofileComponent', () => {
  let component: ProductprofileComponent;
  let fixture: ComponentFixture<ProductprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
