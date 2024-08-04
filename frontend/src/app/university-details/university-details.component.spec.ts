import { ComponentFixture, TestBed } from '@angular/core/testing';

import { universityDetailsComponent } from './university-details.component';

describe('universityDetailsComponent', () => {
  let component: universityDetailsComponent;
  let fixture: ComponentFixture<universityDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [universityDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(universityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
