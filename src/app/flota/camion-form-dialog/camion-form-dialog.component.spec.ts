import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamionFormDialogComponent } from './camion-form-dialog.component';

describe('CamionFormDialogComponent', () => {
  let component: CamionFormDialogComponent;
  let fixture: ComponentFixture<CamionFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CamionFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamionFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
