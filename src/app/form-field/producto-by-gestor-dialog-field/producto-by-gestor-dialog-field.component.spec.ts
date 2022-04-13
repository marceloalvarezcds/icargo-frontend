import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createFormGroup } from 'src/app/utils/form-field-test';
import { FormFieldModule } from '../form-field.module';
import { ProductoByGestorDialogFieldComponent } from './producto-by-gestor-dialog-field.component';

describe('ProductoByGestorDialogFieldComponent', () => {
  let component: ProductoByGestorDialogFieldComponent;
  let fixture: ComponentFixture<ProductoByGestorDialogFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        FormFieldModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ProductoByGestorDialogFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoByGestorDialogFieldComponent);
    component = fixture.componentInstance;
    createFormGroup(component);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
