import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleteCantidadCondicionesDialogComponent } from './flete-cantidad-condiciones-dialog.component';

describe('FleteCantidadCondicionesDialogComponent', () => {
  let component: FleteCantidadCondicionesDialogComponent;
  let fixture: ComponentFixture<FleteCantidadCondicionesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FleteCantidadCondicionesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FleteCantidadCondicionesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
