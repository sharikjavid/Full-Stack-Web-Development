import { ComponentFixture, TestBed } from '@angular/core/testing';

import { universityUpdateComponent } from './university-update.component';

describe('universityUpdateComponent', () => {
  let component: universityUpdateComponent;
  let fixture: ComponentFixture<universityUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [universityUpdateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(universityUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
