import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

import { PageFormComponent } from './page-form.component';

describe('PageFormComponent', () => {
  let component: PageFormComponent;
  let fixture: ComponentFixture<PageFormComponent>;
  let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of(true) });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        PipesModule,
        RouterTestingModule,
      ],
      providers: [ AuthService, UserService ],
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
    const backSpy = spyOn(component, 'back').and.callThrough();
    const button = fixture.debugElement.nativeElement.querySelector('#back-button');
    button.click();
    tick();
    expect(backSpy).toHaveBeenCalled();
  }));

  it('should back and isShow = true and hasChange = true', fakeAsync(() => {
    component.isShow = true;
    component.hasChange = true;
    const backSpy = spyOn(component, 'back').and.callThrough();
    const button = fixture.debugElement.nativeElement.querySelector('#back-button');
    button.click();
    tick();
    expect(backSpy).toHaveBeenCalled();
  }));

  it('should back and isShow = false and hasChange = true', fakeAsync(() => {
    const dialogSpy = spyOn((component as any).dialog, 'open').and.returnValue(dialogRefSpyObj);
    component.isShow = false;
    component.hasChange = true;
    const backSpy = spyOn(component, 'back').and.callThrough();
    const button = fixture.debugElement.nativeElement.querySelector('#back-button');
    button.click();
    tick();
    expect(backSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalled();
  }));
});
