import { CommonModule } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

import { LoginComponent } from './login.component';

@Component({ template: '' })
class TestComponent { }

describe('LoginComponent', () => {
  let authService: AuthService;
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpController: HttpTestingController;
  const router = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        HttpClientTestingModule,
        MaterialModule,
        MatIconTestingModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: '', component: TestComponent }
        ]),
      ],
      providers: [
        AuthService,
        { provide: Router, useValue: router }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ LoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    authService = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    httpController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call auth login method', fakeAsync(() => {
    const loginSpy = spyOn(authService , 'login').and.callThrough();
    const loginElement = fixture.debugElement.query(By.css('form'));

    component.loginForm.controls['username'].setValue('user');
    component.loginForm.controls['password'].setValue('123');
    loginElement.triggerEventHandler('ngSubmit', null);
  
    expect(loginSpy).toHaveBeenCalledTimes(1);
    fixture.detectChanges();

    const url = `${environment.api}/login/`;
    const httpRequest = httpController.expectOne(url);

    httpRequest.flush({}); // Execute subscribe of login Observable

    expect(router.navigate).toHaveBeenCalledTimes(1);
   }));
});
