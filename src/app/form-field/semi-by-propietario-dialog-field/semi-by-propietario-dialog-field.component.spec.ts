import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemiByPropietarioDialogFieldComponent } from './semi-by-propietario-dialog-field.component';

describe('SemiByPropietarioDialogFieldComponent', () => {
  let component: SemiByPropietarioDialogFieldComponent;
  let fixture: ComponentFixture<SemiByPropietarioDialogFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SemiByPropietarioDialogFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SemiByPropietarioDialogFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
