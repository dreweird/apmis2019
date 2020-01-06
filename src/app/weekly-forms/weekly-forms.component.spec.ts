import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyFormsComponent } from './weekly-forms.component';

describe('WeeklyFormsComponent', () => {
  let component: WeeklyFormsComponent;
  let fixture: ComponentFixture<WeeklyFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeeklyFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
