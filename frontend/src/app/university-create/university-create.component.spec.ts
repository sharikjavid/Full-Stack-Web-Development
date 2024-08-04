import { ComponentFixture, TestBed } from '@angular/core/testing';

import { universityCreateComponent } from './university-create.component';

describe('universityCreateComponent', () => {
  let component: universityCreateComponent;
  let fixture: ComponentFixture<universityCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [universityCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(universityCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
