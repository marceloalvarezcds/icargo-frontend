import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { PRINCIPAL_BREAKPOINT } from 'src/app/contanst';
import { mockUserAccount } from 'src/app/interfaces/user';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AuthService } from 'src/app/services/auth.service';
import { ResponsiveService } from 'src/app/services/responsive.service';
import { UserService } from 'src/app/services/user.service';

import { PageComponent } from './page.component';

describe('PageComponent', () => {
  let component: PageComponent;
  let fixture: ComponentFixture<PageComponent>;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        CommonModule,
        MaterialModule,
        PipesModule,
        RouterTestingModule,
      ],
      providers: [ AuthService, ResponsiveService, UserService ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ PageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    fixture = TestBed.createComponent(PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should force trigger onResize method when window is resized', () => {
    const spyOnResize = spyOn(component, 'onResize').and.callThrough();
    component.onResize();
    expect(spyOnResize).toHaveBeenCalled();
  });

  it('test closeSidebarMenu viewport width < PRINCIPAL_BREAKPOINT', () => {
    const spyCloseSidebarMenu = spyOn(component as any, 'configSidebarMode').and.callThrough();
    viewport.set(PRINCIPAL_BREAKPOINT - 800);
    (component as any).configSidebarMode();
    expect(spyCloseSidebarMenu).toHaveBeenCalled();
  });

  it('test closeSidebarMenu viewport width > PRINCIPAL_BREAKPOINT', () => {
    const spyCloseSidebarMenu = spyOn(component as any, 'configSidebarMode').and.callThrough();
    viewport.set(PRINCIPAL_BREAKPOINT + 100);
    (component as any).configSidebarMode();
    expect(spyCloseSidebarMenu).toHaveBeenCalled();
  });
});
