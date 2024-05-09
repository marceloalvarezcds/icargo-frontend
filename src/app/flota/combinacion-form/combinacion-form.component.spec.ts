import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinacionFormComponent } from './combinacion-form.component';

describe('CombinacionFormComponent', () => {
  let component: CombinacionFormComponent;
  let fixture: ComponentFixture<CombinacionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CombinacionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CombinacionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
