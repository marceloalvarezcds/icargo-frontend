import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiudadMapDialogFieldComponent } from './ciudad-map-dialog-field.component';

describe('CiudadMapDialogFieldComponent', () => {
  let component: CiudadMapDialogFieldComponent;
  let fixture: ComponentFixture<CiudadMapDialogFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CiudadMapDialogFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CiudadMapDialogFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
