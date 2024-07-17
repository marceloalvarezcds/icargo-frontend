import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PARAGUAY_LATLNG, PRINCIPAL_BREAKPOINT } from 'src/app/contanst';
import { GoogleMapService } from 'src/app/services/google-map.service';
import { MenuConfigService } from 'src/app/services/menu-config.service';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent implements AfterViewInit, OnDestroy {
  googleMap?: GoogleMap;
  options: google.maps.MapOptions = {
    streetViewControl: false,
    fullscreenControlOptions: {
      position: 9 as google.maps.ControlPosition.RIGHT_BOTTOM,
    },
    mapTypeControlOptions: {
      position: 7 as google.maps.ControlPosition.RIGHT_TOP,
    },
    zoomControlOptions: {
      position: 8 as google.maps.ControlPosition.RIGHT_CENTER,
    },
  };
  zoom = 11;
  listenerActive = false;
  latLng: google.maps.LatLngLiteral = PARAGUAY_LATLNG;
  marker?: google.maps.Marker;

  menuToggleSubscription = this.menuConfigService
    .getToggleSidebarMenuObservable()
    .pipe(filter(() => PRINCIPAL_BREAKPOINT < window.innerWidth))
    .subscribe((isOpen) => {
      this.updateWidth(isOpen);
    });

  get map(): google.maps.Map | undefined {
    return this.googleMap!.googleMap;
  }

  get width$(): Observable<number> {
    return this.googleMapService.width$;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateWidth(PRINCIPAL_BREAKPOINT <= window.innerWidth);
  }

  @Input() title = '';
  @Input() isShow = false;
  @Input() showMarker = false;
  @Input() height = 450;
  @Input() width = 990;
  @Input() set center(latLng: google.maps.LatLngLiteral | undefined) {
    if (latLng) {
      this.latLng = latLng;
    }
  }
  @Input() set isPanelOpen(isOpen: boolean) {
    if (isOpen && this.showMarker) {
      this.addMarker(this.latLng);
    }
  }

  @Output() mapClick = new EventEmitter<google.maps.MapMouseEvent>();

  @ViewChild('clickOnMapButton', { read: ElementRef })
  clickOnMapButton!: ElementRef<HTMLButtonElement>;
  @ViewChild(GoogleMap) set googleMapComponent(googleMap: GoogleMap) {
    this.googleMap = googleMap;
    this.addClickOnMapButtonOnMap();
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    private googleMapService: GoogleMapService,
    private menuConfigService: MenuConfigService
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateWidth(PRINCIPAL_BREAKPOINT <= window.innerWidth);
    }, 0);
  }

  ngOnDestroy(): void {
    this.menuToggleSubscription.unsubscribe();
  }

  addListenerMapClick(): void {
    this.listenerActive = true;
    google.maps.event.addListener(
      this.map!,
      'click',
      this.mapClickEvent.bind(this)
    );
  }

  private addClickOnMapButtonOnMap(): void {
    this.map!.controls[google.maps.ControlPosition.LEFT_TOP].push(
      this.clickOnMapButton.nativeElement
    );
  }

  private addMarker(position: google.maps.LatLngLiteral) {
    if (this.marker) {
      this.marker.setMap(null);
    }
    this.marker = new google.maps.Marker({ position, title: this.title });
    this.marker.setMap(this.map!);
  }

  private removeListenerMapClick(): void {
    google.maps.event.clearListeners(this.map!, 'click');
    this.listenerActive = false;
    this.cdRef.detectChanges();
  }

  private mapClickEvent(event: google.maps.MapMouseEvent) {
    this.mapClick.emit(event);
    this.addMarker(event.latLng.toJSON());
    this.removeListenerMapClick();
  }

  private updateWidth(isOpenMenu: boolean): void {
    if (this.width) {
      this.googleMapService.setWidth(this.width);
      return;
    }
    if (isOpenMenu) {
      this.googleMapService.setWidth(window.innerWidth - 336);
    } else {
      this.googleMapService.setWidth(window.innerWidth - 96);
    }
  }
}
