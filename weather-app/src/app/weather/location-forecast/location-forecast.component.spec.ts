import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationForecastComponent } from './location-forecast.component';

describe('CityForecastComponent', () => {
  let component: LocationForecastComponent;
  let fixture: ComponentFixture<LocationForecastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocationForecastComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
