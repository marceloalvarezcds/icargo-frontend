import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PRINCIPAL_BREAKPOINT } from 'src/app/contanst';
import { MaterialModule } from 'src/app/material/material.module';
import { ResponsiveService } from 'src/app/services/responsive.service';

import { PageComponent } from './page.component';

describe('PageComponent', () => {
  let component: PageComponent;
  let fixture: ComponentFixture<PageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        MaterialModule,
      ],
      providers: [ ResponsiveService ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ PageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
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
