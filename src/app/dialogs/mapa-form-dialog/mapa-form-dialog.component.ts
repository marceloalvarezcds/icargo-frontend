import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { filter, map } from 'rxjs/operators';
import { Observable, Subscription, zip } from 'rxjs';
import { Ciudad } from 'src/app/interfaces/ciudad';
import { GoogleMap } from '@angular/google-maps';
import { PARAGUAY_LATLNG } from 'src/app/contanst';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-mapa-form-dialog',
  templateUrl: './mapa-form-dialog.component.html',
  styleUrls: ['./mapa-form-dialog.component.scss']
})
export class MapaFormDialogComponent implements OnDestroy{
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

  // menuToggleSubscription = this.menuConfigService
  //   .getToggleSidebarMenuObservable()
  //   .pipe(filter(() => PRINCIPAL_BREAKPOINT < window.innerWidth))
  //   .subscribe((isOpen) => {
  //     this.updateWidth(isOpen);
  //   });

  get map(): google.maps.Map | undefined {
    return this.googleMap!.googleMap;
  }

  constructor(public dialogRef: MatDialogRef<MapaFormDialogComponent>,
              private fb: FormBuilder) { }

  latLngSubscription?: Subscription;
  formGroup?: FormGroup;
  markerPosition?: google.maps.LatLngLiteral;

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

  @Input() ciudadSelected?: Ciudad | null;
  @Input() set form(f: FormGroup) {
    this.formGroup = f;
    this.latLngSubscription = zip(this.latitudControl.valueChanges, this.longitudControl.valueChanges)
      .pipe(filter(x => (x[0] && x[1])))
      .pipe(map((x) => new google.maps.LatLng(x[0], x[1])))
      .subscribe(latLng => {
        this.markerPosition = latLng.toJSON();
      });
  }

  ngOnDestroy(): void {
    this.latLngSubscription?.unsubscribe();
  }

  updateMarkerPosition(event: google.maps.MapMouseEvent): void {
    this.geo!.controls['latitud'].setValue(event.latLng.lat());
    this.geo!.controls['longitud'].setValue(event.latLng.lng());
  }
  @Input() isPanelOpen = false;
  @Input() title = '';
  @Input() isShow = false;
  @Input() showMarker = false;
  @Input() height = 450;
  @Input() width = 0;
  @Input() set center(latLng: google.maps.LatLngLiteral | undefined) {
    if (latLng) {
      this.latLng = latLng;
    }
  }


 
}
