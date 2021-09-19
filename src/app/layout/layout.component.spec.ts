/// <reference types="karma-viewport" />
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { PRINCIPAL_BREAKPOINT } from '../contanst';
import { MaterialModule } from '../material/material.module';
import { MenuConfigService } from '../services/menu-config.service';
import { SharedModule } from '../shared/shared.module';

import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let menuConfigService: MenuConfigService;
  let openSidenavSpy: any;
  let closeSidenavSpy: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        HttpClientTestingModule,
        MaterialModule,
        MatIconTestingModule,
        RouterTestingModule,
        SharedModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [ MenuConfigService ],
      declarations: [ LayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    menuConfigService = TestBed.inject(MenuConfigService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    openSidenavSpy = spyOn(component.sidenav!, 'open');
    closeSidenavSpy = spyOn(component.sidenav!, 'close');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test menuConfigService', fakeAsync(() => {
    menuConfigService.setSidebarMenu(true);
    flushMicrotasks();
    fixture.detectChanges();
    expect(openSidenavSpy).toHaveBeenCalled();

    menuConfigService.setSidebarMenu(false);
    flushMicrotasks();
    fixture.detectChanges();
    expect(closeSidenavSpy).toHaveBeenCalled();

    menuConfigService.setSidebarMenu(true);
    flushMicrotasks();
    fixture.detectChanges();
    expect(openSidenavSpy).toHaveBeenCalled();
  }));

  it('should trigger onResize method when window is resized', () => {
    const spyOnResize = spyOn(component, 'onResize');

    window.dispatchEvent(new Event('resize'));
    viewport.set(PRINCIPAL_BREAKPOINT - 800);
    expect(spyOnResize).toHaveBeenCalled();

    window.dispatchEvent(new Event('resize'));
    viewport.set(PRINCIPAL_BREAKPOINT + 100);
    expect(spyOnResize).toHaveBeenCalled();
  });

  it('should force trigger onResize method when window is resized', () => {
    const spyOnResize = spyOn(component, 'onResize').and.callThrough();
    component.onResize();
    expect(spyOnResize).toHaveBeenCalled();
  });

  it('test closeSidebarMenu viewport width < PRINCIPAL_BREAKPOINT', fakeAsync(() => {
    const spyCloseSidebarMenu = spyOn(component, 'closeSidebarMenu').and.callThrough();
    viewport.set(PRINCIPAL_BREAKPOINT - 800);
    component.closeSidebarMenu();
    expect(spyCloseSidebarMenu).toHaveBeenCalled();
  }));

  it('test closeSidebarMenu viewport width > PRINCIPAL_BREAKPOINT', fakeAsync(() => {
    const spyCloseSidebarMenu = spyOn(component, 'closeSidebarMenu').and.callThrough();
    viewport.set(PRINCIPAL_BREAKPOINT + 100);
    component.closeSidebarMenu();
    expect(spyCloseSidebarMenu).toHaveBeenCalled();
  }));
});
