import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FleteList } from 'src/app/interfaces/flete';
import { OrdenCargaForm } from 'src/app/interfaces/orden-carga';
import { CamionSemiNetoService } from 'src/app/services/camion-semi-neto.service';
import { numberWithCommas } from 'src/app/utils/thousands-separator';
import { NumberValidator } from 'src/app/validators/number-validator';

@Component({
  selector: 'app-orden-carga-create-form-info',
  templateUrl: './orden-carga-create-form-info.component.html',
  styleUrls: ['./orden-carga-create-form-info.component.scss'],
})
export class OrdenCargaCreateFormInfoComponent implements OnDestroy {
  formGroup?: FormGroup;
  groupName = 'info';
  subscription?: Subscription;
  neto?: string | number;
  fl?: FleteList;

  @Input() set form(f: FormGroup | undefined) {
    this.formGroup = f;
    if (f) {
      this.subscription = this.combinacion.valueChanges
        .pipe(
          filter(
            (c: Partial<OrdenCargaForm>) =>
              !!(this.flete && c.camion_id && c.semi_id)
          )
        )
        .subscribe((c: Partial<OrdenCargaForm>) => {
          this.getListByCamionIdAndSemiIdAndProductoId(c.camion_id, c.semi_id);
        });
    }
    if (this.flete) {
      this.getListByCamionIdAndSemiIdAndProductoId(
        this.camionIdControl.value,
        this.semiIdControl.value
      );
    }
  }
  @Input() set flete(f: FleteList | undefined) {
    this.fl = f;
    if (f) {
      this.getListByCamionIdAndSemiIdAndProductoId(
        this.camionIdControl.value,
        this.semiIdControl.value
      );
    }
  }

  @Output() netoChange = new EventEmitter<string>();

  get flete(): FleteList | undefined {
    return this.fl;
  }

  get combinacion(): FormGroup {
    return this.formGroup!.get('combinacion') as FormGroup;
  }

  get group(): FormGroup {
    return this.formGroup!.get(this.groupName) as FormGroup;
  }

  get cantidadNominadaControl(): FormControl {
    return this.group.get('cantidad_nominada') as FormControl;
  }

  get camionIdControl(): FormControl {
    return this.combinacion.get('camion_id') as FormControl;
  }

  get semiIdControl(): FormControl {
    return this.combinacion.get('semi_id') as FormControl;
  }

  constructor(private camionSemiNetoService: CamionSemiNetoService) {}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private getListByCamionIdAndSemiIdAndProductoId(
    camionId?: number,
    semiId?: number
  ): void {
    if (camionId && semiId) {
      this.camionSemiNetoService
        .getListByCamionIdAndSemiIdAndProductoId(
          camionId,
          semiId,
          this.flete!.producto_id
        )
        .subscribe((camionSemiNeto) => {
          this.neto = camionSemiNeto?.neto;
          this.cantidadNominadaControl.setValidators(
            NumberValidator.max(this.neto ?? 0)
          );
          this.cantidadNominadaControl.updateValueAndValidity();
          if (this.neto) {
            this.netoChange.emit(numberWithCommas(this.neto));
          }
        });
    }
  }
}
