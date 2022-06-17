import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FleteList, mockFleteList } from 'src/app/interfaces/flete';
import { MaterialModule } from 'src/app/material/material.module';
import { DialogFormFieldControlComponent } from './dialog-form-field-control.component';

describe('DialogFormFieldControlComponent', () => {
  @Component({
    template: `<mat-form-field>
      <mat-label>{{ title }}</mat-label>
      <app-dialog-form-field-control
        [descripcionPropName]="inputValuePropName"
        [columns]="columns"
        [list]="list"
        [title]="title"
        [formControl]="control"
      ></app-dialog-form-field-control>
    </mat-form-field> `,
  })
  class TestComponent {
    columns = [
      { def: 'selector', title: '', sticky: true },
      {
        def: 'id',
        title: 'Nº',
        value: (element: FleteList) => element.id,
        sticky: true,
      },
    ];
    list = mockFleteList;
    inputValuePropName = 'info';
    title = 'Flete';
    control = new FormControl('');

    @ViewChild(DialogFormFieldControlComponent)
    component?: DialogFormFieldControlComponent<FleteList>;
  }

  let parentComponent: TestComponent;
  let component: DialogFormFieldControlComponent<FleteList> | undefined;
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
      declarations: [DialogFormFieldControlComponent, TestComponent],
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
