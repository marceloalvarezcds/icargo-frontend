import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Ciudad } from 'src/app/interfaces/ciudad';

@Component({
  selector: 'app-page-form-map',
  templateUrl: './page-form-map.component.html',
  styleUrls: ['./page-form-map.component.scss']
})
export class PageFormMapComponent {

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
  @Input() isShow = false;
  @Input() isPanelOpen = false;
  @Input() groupName = 'address';
  @Output() ciudadChanged = new EventEmitter<Ciudad>();
  @Input() set form(f: FormGroup) {
    this.formGroup = f;
  }

  get address(): FormGroup {
    return this.formGroup!.get(this.groupName) as FormGroup;
  }

  get ciudadControl(): FormControl {
    return this.address!.get('ciudad_id') as FormControl;
  }

  ciudadChange(ciudad: Ciudad){
    this.address.controls["localidad_nombre"]?.setValue(ciudad.localidad_nombre)
    this.address.controls["pais_nombre"]?.setValue(ciudad.pais_nombre)
  }

  updateMarkerPosition(event: google.maps.MapMouseEvent): void {
    this.geo!.controls['latitud'].setValue(event.latLng.lat());
    this.geo!.controls['longitud'].setValue(event.latLng.lng());
  }

}


