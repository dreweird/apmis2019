import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommodityValidationComponent } from './commodity-validation.component';

describe('CommodityValidationComponent', () => {
  let component: CommodityValidationComponent;
  let fixture: ComponentFixture<CommodityValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommodityValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommodityValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
