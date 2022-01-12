import { Component, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FleteList } from 'src/app/interfaces/flete';
import { OrdenCargaForm } from 'src/app/interfaces/orden-carga';
import { CamionSemiNetoService } from 'src/app/services/camion-semi-neto.service';
import { NumberValidator } from 'src/app/validators/number-validator';

@Component({
  selector: 'app-orden-carga-create-form-info',
  templateUrl: './orden-carga-create-form-info.component.html',
  styleUrls: ['./orden-carga-create-form-info.component.scss']
})
export class OrdenCargaCreateFormInfoComponent implements OnDestroy {

  formGroup?: FormGroup;
  groupName = 'info';
  subscription?: Subscription;
  neto?: string | number;

  @Input() set form(f: FormGroup) {
    this.formGroup = f;
    this.subscription = this.combinacion.valueChanges
      .pipe(filter((c: Partial<OrdenCargaForm>) => !!(c.camion_id && c.semi_id && c.flete_id)))
      .subscribe((c: Partial<OrdenCargaForm>) => {
        this.camionSemiNetoService
          .getListByCamionIdAndSemiIdAndProductoId(c.camion_id!, c.semi_id!, this.flete!.producto_id)
          .subscribe(camionSemiNeto => {
            this.neto = camionSemiNeto?.neto;
            this.cantidadNominadaControl.setValidators(NumberValidator.max(this.neto ?? 0));
            this.cantidadNominadaControl.updateValueAndValidity();
          });
      });
  }
  @Input() flete?: FleteList;

  get combinacion(): FormGroup {
    return this.formGroup!.get('combinacion') as FormGroup;
  }

  get group(): FormGroup {
    return this.formGroup!.get(this.groupName) as FormGroup;
  }

  get cantidadNominadaControl(): FormControl {
    return this.group.get('cantidad_nominada') as FormControl;
  }

  constructor(private camionSemiNetoService: CamionSemiNetoService) { }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
