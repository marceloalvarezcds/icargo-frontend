import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PARAGUAY_LATLNG, PRINCIPAL_BREAKPOINT } from 'src/app/contanst';
import { Ciudad } from 'src/app/interfaces/ciudad';
import { GoogleMapDialogData } from 'src/app/interfaces/google-map-dialog-data';
import { GoogleMapService } from 'src/app/services/google-map.service';
import { MenuConfigService } from 'src/app/services/menu-config.service';
import { ResponsiveService } from 'src/app/services/responsive.service';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent implements AfterViewInit, OnDestroy {
  formGroup?: FormGroup;
  googleMap?: GoogleMap;
  get info(): FormGroup {
    return this.formGroup!.get('info') as FormGroup;
  }

  get geo(): FormGroup {
    return this.formGroup!.get('geo') as FormGroup;
  }

  get latitudControl(): FormControl {
    return this.geo!.get('latitud') as FormControl;
  }

  get longitudControl(): FormControl {
    return this.geo!.get('longitud') as FormControl;
  }

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

  @Input() groupName = 'address';
  
  get map(): google.maps.Map | undefined {
    return this.googleMap!.googleMap;
  }

  get width$(): Observable<number> {
    return this.googleMapService.width$;
  }
 
  markerPosition?: google.maps.LatLngLiteral;

  @Input() ciudadSelected?: Ciudad | null;
  @Input() isShowAddress = false;
  @Input() isPanelOpenAddress = false;
  @Input() groupNameAddress = 'address';
  @Input() set form(f: FormGroup) {
    this.formGroup = f;
  }

  get address(): FormGroup {
    return this.formGroup!.get(this.groupName) as FormGroup;
  }

  get ciudadControl(): FormControl {
    return this.address!.get('ciudad_id') as FormControl;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateWidth(PRINCIPAL_BREAKPOINT <= window.innerWidth);
  }

  @Input() title = '';
  @Input() isShow = false;
  @Input() showMarker = false;
  @Input() height = 320;
  @Input() width = 1000;
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
    private menuConfigService: MenuConfigService,
    private responsiveService: ResponsiveService,
    public dialogRef: MatDialogRef<GoogleMapComponent>,
    @Inject(MAT_DIALOG_DATA) private data?: GoogleMapDialogData
  ) {
    this.formGroup = data?.form
    console.log("data", data)
    }
    updateMarkerPosition(event: google.maps.MapMouseEvent): void {
      this.geo!.controls['latitud'].setValue(event.latLng.lat());
      this.geo!.controls['longitud'].setValue(event.latLng.lng());
    }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateWidth(PRINCIPAL_BREAKPOINT <= window.innerWidth);
    }, 0);
  }

  ngOnDestroy(): void {
    this.menuToggleSubscription.unsubscribe();
  }
  closeMap(): void {
    this.dialogRef.close(); 
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
    let widthToSustract = 0;
    if (this.responsiveService.isMobileScreen) {
      if (isOpenMenu) {
        widthToSustract = 336;
      } else {
        widthToSustract = 96;
      }
    } else {
      if (isOpenMenu) {
        widthToSustract = 398;
      } else {
        widthToSustract = 158;
      }
    }
    this.googleMapService.setWidth(window.innerWidth - widthToSustract);
  }
}
