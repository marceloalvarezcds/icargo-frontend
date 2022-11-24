import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockPermisoList, Permiso } from 'src/app/interfaces/permiso';
import { MaterialModule } from 'src/app/material/material.module';
import { AccionPipe } from './accion.pipe';

import { PermisoFormFieldControlComponent } from './permiso-form-field-control.component';

describe('PermisoFormFieldControlComponent', () => {
  @Component({
    template: `<mat-form-field>
      <mat-label>{{ title }}</mat-label>
      <app-permiso-form-field-control
        [list]="list"
        [formControl]="control"
      ></app-permiso-form-field-control>
    </mat-form-field> `,
  })
  class TestComponent {
    columns = [
      { def: 'selector', title: '', sticky: true },
      {
        def: 'id',
        title: 'Nº',
        value: (element: Permiso) => element.id,
        sticky: true,
      },
    ];
    list = mockPermisoList;
    title = 'Permiso';
    control = new FormControl('');

    @ViewChild(PermisoFormFieldControlComponent)
    component?: PermisoFormFieldControlComponent;
  }

  let parentComponent: TestComponent;
  let component: PermisoFormFieldControlComponent | undefined;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        PermisoFormFieldControlComponent,
        TestComponent,
        AccionPipe,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    parentComponent = fixture.componentInstance;
    fixture.detectChanges();
    component = parentComponent.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
