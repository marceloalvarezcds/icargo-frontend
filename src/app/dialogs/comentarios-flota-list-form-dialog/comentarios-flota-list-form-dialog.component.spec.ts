import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentariosFlotaListFormDialogComponent } from './comentarios-flota-list-form-dialog.component';

describe('ComentariosFlotaListFormDialogComponent', () => {
  let component: ComentariosFlotaListFormDialogComponent;
  let fixture: ComponentFixture<ComentariosFlotaListFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComentariosFlotaListFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComentariosFlotaListFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
