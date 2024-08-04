import { ComponentFixture, TestBed } from '@angular/core/testing';

import { universityListComponent } from './university-list.component';

describe('universityListComponent', () => {
  let component: universityListComponent;
  let fixture: ComponentFixture<universityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [universityListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(universityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
