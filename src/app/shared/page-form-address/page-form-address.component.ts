import { Component, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Ciudad } from 'src/app/interfaces/ciudad';
import { Localidad } from 'src/app/interfaces/localidad';
import { CiudadService } from 'src/app/services/ciudad.service';
import { LocalidadService } from 'src/app/services/localidad.service';
import { PaisService } from 'src/app/services/pais.service';

@Component({
  selector: 'app-page-form-address',
  templateUrl: './page-form-address.component.html',
  styleUrls: ['./page-form-address.component.scss']
})
export class PageFormAddressComponent implements OnDestroy {

  paisList$ = this.paisService.getList();
  paisSubscription?: Subscription;
  localidadList: Localidad[] = [];
  localidadSubscription?: Subscription;
  ciudadList: Ciudad[] = [];
  formGroup?: FormGroup;
  markerPosition?: google.maps.LatLngLiteral;

  @Input() isShow = false;
  @Input() isPanelOpen = false;
  @Input() groupName = "address";
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
  }

  get address(): FormGroup {
    return this.formGroup!.get(this.groupName) as FormGroup;
  }

  get paisControl(): FormControl {
    return this.address!.get('pais_id') as FormControl;
  }

  get localidadControl(): FormControl {
    return this.address!.get('localidad_id') as FormControl;
  }

  constructor(
    private ciudadService: CiudadService,
    private localidadService: LocalidadService,
    private paisService: PaisService,
  ) { }

  ngOnDestroy(): void {
    this.paisSubscription?.unsubscribe();
    this.localidadSubscription?.unsubscribe();
  }
}
