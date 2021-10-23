import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { GoogleMapsModule } from '@angular/google-maps';
import { PARAGUAY_LATLNG, PRINCIPAL_BREAKPOINT } from 'src/app/contanst';
import { GoogleMapService } from 'src/app/services/google-map.service';
import { MenuConfigService } from 'src/app/services/menu-config.service';
import { mockMapMouseEvent } from 'src/app/utils/test';

import { GoogleMapComponent } from './google-map.component';

describe('GoogleMapComponent', () => {
  let component: GoogleMapComponent;
  let fixture: ComponentFixture<GoogleMapComponent>;
  let menuConfigService: MenuConfigService;
  let clickOnMapButton: HTMLButtonElement;
  let updateWidthSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ GoogleMapsModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ GoogleMapService, MenuConfigService ],
      declarations: [ GoogleMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleMapComponent);
    menuConfigService = TestBed.inject(MenuConfigService);
    component = fixture.componentInstance;
    updateWidthSpy = spyOn((component as any), 'updateWidth').and.callThrough();
    fixture.detectChanges();
    const mockMVCArray = new google.maps.MVCArray([]);
    component.googleMap!.googleMap!.controls = [mockMVCArray, mockMVCArray, mockMVCArray, mockMVCArray, mockMVCArray, mockMVCArray];
    clickOnMapButton = component.clickOnMapButton.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call to addListenerMapClick', fakeAsync(() => {
    const addMarkerSpy = spyOn((component as any), 'addMarker').and.callThrough();
    const mapClickEventSpy = spyOn((component as any), 'mapClickEvent').and.callThrough();
    const removeListenerMapClickSpy = spyOn((component as any), 'removeListenerMapClick').and.callThrough();
    fixture.detectChanges();
    clickOnMapButton.click();
    (component as any).mapClickEvent(mockMapMouseEvent);
    tick();
    (component as any).mapClickEvent(mockMapMouseEvent);
    tick();
    expect(addMarkerSpy).toHaveBeenCalled();
    expect(mapClickEventSpy).toHaveBeenCalled();
    expect(removeListenerMapClickSpy).toHaveBeenCalled();
  }));

  it('test menuConfigService', fakeAsync(() => {
    menuConfigService.setSidebarMenu(true);
    flushMicrotasks();
    menuConfigService.setSidebarMenu(false);
    flushMicrotasks();
    fixture.detectChanges();
    expect(updateWidthSpy).toHaveBeenCalled();
  }));

  it('should trigger onResize method when window is resized', () => {
    const spyOnResize = spyOn(component, 'onResize').and.callThrough();

    fixture.detectChanges();

    window.dispatchEvent(new Event('resize'));
    viewport.set(PRINCIPAL_BREAKPOINT - 800);
    expect(spyOnResize).toHaveBeenCalled();

    window.dispatchEvent(new Event('resize'));
    viewport.set(PRINCIPAL_BREAKPOINT + 100);
    expect(spyOnResize).toHaveBeenCalled();
  });

  it('test inputs value', () => {
    component.center = PARAGUAY_LATLNG;
    component.showMarker = true;
    component.isPanelOpen = true;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('test inputs undefined', () => {
    component.center = undefined;
    component.isPanelOpen = false;
    component.showMarker = true;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
