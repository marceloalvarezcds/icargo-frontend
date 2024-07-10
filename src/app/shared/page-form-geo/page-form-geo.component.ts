import { Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, zip } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ContactoFormDialogComponent } from 'src/app/dialogs/contacto-form-dialog/contacto-form-dialog.component';
import { MapaFormDialogComponent } from 'src/app/dialogs/mapa-form-dialog/mapa-form-dialog.component';
import { Ciudad } from 'src/app/interfaces/ciudad';
import { ContactoGestorCargaList } from 'src/app/interfaces/contacto-gestor-carga';
import { GoogleMapComponent } from '../google-map/google-map.component';

@Component({
  selector: 'app-page-form-geo',
  templateUrl: './page-form-geo.component.html',
  styleUrls: ['./page-form-geo.component.scss']
})
export class PageFormGeoComponent implements OnDestroy {

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
  @Input() isShow = false;
  @Input() isPanelOpen = false;

  ngOnDestroy(): void {
    this.latLngSubscription?.unsubscribe();
  }

  updateMarkerPosition(event: google.maps.MapMouseEvent): void {
    this.geo!.controls['latitud'].setValue(event.latLng.lat());
    this.geo!.controls['longitud'].setValue(event.latLng.lng());
  }
  constructor(private fb: FormBuilder, private dialog: MatDialog) {}
  addCiudad(): void {
    this.dialog
    .open(GoogleMapComponent, {
      width: '80%', // Aquí puedes especificar el ancho deseado
      height: '80%',
      data:{form: this.formGroup}
      
    })
  }

}
