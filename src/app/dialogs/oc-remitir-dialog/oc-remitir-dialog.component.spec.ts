import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcRemitirDialogComponent } from './oc-remitir-dialog.component';

describe('OcRemitirDialogComponent', () => {
  let component: OcRemitirDialogComponent;
  let fixture: ComponentFixture<OcRemitirDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcRemitirDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcRemitirDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
