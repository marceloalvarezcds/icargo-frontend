import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentariosFlotaFormDialogComponent } from './comentarios-flota-form-dialog.component';

describe('ComentariosFlotaFormDialogComponent', () => {
  let component: ComentariosFlotaFormDialogComponent;
  let fixture: ComponentFixture<ComentariosFlotaFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComentariosFlotaFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComentariosFlotaFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
