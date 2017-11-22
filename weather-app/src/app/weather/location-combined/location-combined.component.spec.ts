import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationCombinedComponent } from './location-combined.component';

describe('LocationCombinedComponent', () => {
  let component: LocationCombinedComponent;
  let fixture: ComponentFixture<LocationCombinedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationCombinedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationCombinedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
