import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoferByPropietarioDialogFieldComponent } from './chofer-by-propietario-dialog-field.component';

describe('ChoferByPropietarioDialogFieldComponent', () => {
  let component: ChoferByPropietarioDialogFieldComponent;
  let fixture: ComponentFixture<ChoferByPropietarioDialogFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoferByPropietarioDialogFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoferByPropietarioDialogFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
