import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';

import { PageFormComponent } from './page-form.component';

describe('PageFormComponent', () => {
  let component: PageFormComponent;
  let fixture: ComponentFixture<PageFormComponent>;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of(true) });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ PageFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageFormComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({
      nombre: new FormControl(''),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should back', fakeAsync(() => {
    const dialogSpy = spyOn((component as any).dialog, 'open').and.returnValue(dialogRefSpyObj);
    const backSpy = spyOn(component, 'back').and.callThrough();
    const button = fixture.debugElement.nativeElement.querySelector('#back-button');
    button.click();
    tick();
    expect(backSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalled();
  }));

  it('should back and isShow = true', fakeAsync(() => {
    component.isShow = true;
    const backSpy = spyOn(component, 'back').and.callThrough();
    const button = fixture.debugElement.nativeElement.querySelector('#back-button');
    button.click();
    tick();
    expect(backSpy).toHaveBeenCalled();
  }));
});
