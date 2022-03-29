import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelectableMovimientoTableComponent } from './selectable-movimiento-table.component';

describe('SelectableMovimientoTableComponent', () => {
  let component: SelectableMovimientoTableComponent;
  let fixture: ComponentFixture<SelectableMovimientoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [SelectableMovimientoTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectableMovimientoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
