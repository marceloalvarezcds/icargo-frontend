import { Component, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription, zip } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Ciudad } from 'src/app/interfaces/ciudad';
import { Localidad } from 'src/app/interfaces/localidad';
import { CiudadService } from 'src/app/services/ciudad.service';
import { LocalidadService } from 'src/app/services/localidad.service';
import { PaisService } from 'src/app/services/pais.service';

@Component({
  selector: 'app-centros-operativos-form-geo',
  templateUrl: './centros-operativos-form-geo.component.html',
  styleUrls: ['./centros-operativos-form-geo.component.scss']
})
export class CentrosOperativosFormGeoComponent implements OnDestroy {

  paisList$ = this.paisService.getList();
  paisSubscription?: Subscription;
  localidadList: Localidad[] = [];
  localidadSubscription?: Subscription;
  latLngSubscription?: Subscription;
  ciudadList: Ciudad[] = [];
  formGroup?: FormGroup;
  markerPosition?: google.maps.LatLngLiteral;

  get info(): FormGroup {
    return this.formGroup!.get('info') as FormGroup;
  }

  get geo(): FormGroup {
    return this.formGroup!.get('geo') as FormGroup;
  }

  get paisControl(): FormControl {
    return this.geo!.get('pais_id') as FormControl;
  }

  get localidadControl(): FormControl {
    return this.geo!.get('localidad_id') as FormControl;
  }

  get latitudControl(): FormControl {
    return this.geo!.get('latitud') as FormControl;
  }

  get longitudControl(): FormControl {
    return this.geo!.get('longitud') as FormControl;
  }

  @Input() set form(f: FormGroup) {
    this.formGroup = f;
    this.paisSubscription = this.paisControl.valueChanges.pipe(filter(v => !!v)).subscribe(paisId => {
      this.localidadService.getList(paisId).subscribe(list => {
        this.localidadList = list;
      });
    });
    this.localidadSubscription = this.localidadControl.valueChanges.pipe(filter(v => !!v)).subscribe(localidadId => {
      this.ciudadService.getList(localidadId).subscribe(list => {
        this.ciudadList = list;
      });
    });
    this.latLngSubscription = zip(this.latitudControl.valueChanges, this.longitudControl.valueChanges)
      .pipe(filter(x => (x[0] && x[1])))
      .pipe(map((x) => new google.maps.LatLng(x[0], x[1])))
      .subscribe(latLng => {
        this.markerPosition = latLng.toJSON();
      });
  }
  @Input() isShow = false;
  @Input() isPanelOpen = false;

  constructor(
    private ciudadService: CiudadService,
    private localidadService: LocalidadService,
    private paisService: PaisService,
  ) { }

  ngOnDestroy(): void {
    this.paisSubscription?.unsubscribe();
    this.localidadSubscription?.unsubscribe();
  }

  updateMarkerPosition(event: google.maps.MapMouseEvent): void {
    this.geo!.controls['latitud'].setValue(event.latLng.lat());
    this.geo!.controls['longitud'].setValue(event.latLng.lng());
  }
}
