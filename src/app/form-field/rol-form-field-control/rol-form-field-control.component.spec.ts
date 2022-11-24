import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { mockRolCheckedList, RolChecked } from 'src/app/interfaces/rol';
import { MaterialModule } from 'src/app/material/material.module';

import { RolFormFieldControlComponent } from './rol-form-field-control.component';

describe('RolFormFieldControlComponent', () => {
  @Component({
    template: `<mat-form-field>
      <mat-label>{{ title }}</mat-label>
      <app-rol-form-field-control
        [list]="list"
        [formControl]="control"
      ></app-rol-form-field-control>
    </mat-form-field> `,
  })
  class TestComponent {
    columns = [
      { def: 'selector', title: '', sticky: true },
      {
        def: 'id',
        title: 'Nº',
        value: (element: RolChecked) => element.id,
        sticky: true,
      },
    ];
    list = mockRolCheckedList;
    title = 'Rol';
    control = new FormControl('');

    @ViewChild(RolFormFieldControlComponent)
    component?: RolFormFieldControlComponent;
  }

  let parentComponent: TestComponent;
  let component: RolFormFieldControlComponent | undefined;
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
      declarations: [RolFormFieldControlComponent, TestComponent],
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
