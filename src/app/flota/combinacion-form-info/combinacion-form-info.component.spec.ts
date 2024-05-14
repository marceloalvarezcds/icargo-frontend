import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinacionFormInfoComponent } from './combinacion-form-info.component';

describe('CombinacionFormInfoComponent', () => {
  let component: CombinacionFormInfoComponent;
  let fixture: ComponentFixture<CombinacionFormInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CombinacionFormInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CombinacionFormInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
