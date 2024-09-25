import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CommentDialogComponent } from 'src/app/dialogs/comment-dialog/comment-dialog.component';
import { FleteList } from 'src/app/interfaces/flete';
import { OrdenCarga, OrdenCargaForm } from 'src/app/interfaces/orden-carga';
import { OrdenCargaComentariosHistorial } from 'src/app/interfaces/orden_carga_comentarios_historial';
import { CombinacionService } from 'src/app/services/combinacion.service';
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
  @Input() disableForm: boolean = false;
  @Input() disabled: boolean | undefined;
  @Input() oc?: OrdenCarga;
  @Input() list: OrdenCargaComentariosHistorial[] = [];

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
          this.getListByCamionIdAndSemiId(c.camion_id, c.semi_id);
        });
    }
    if (this.flete) {
      this.getListByCamionIdAndSemiId(
        this.camionIdControl.value,
        this.semiIdControl.value
      );
    }
  }
  @Input() set flete(f: FleteList | undefined) {
    this.fl = f;
    if (f) {
      this.getListByCamionIdAndSemiId(
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

  get historialComentariosList(): OrdenCargaComentariosHistorial[] {
    return this.oc!?.comentario.slice();
  }

  get gestorCargaId(): number | undefined {
    return this.oc!?.gestor_carga_id;
  }

  constructor(private camionSemiNetoService: CombinacionService, private matDialog: MatDialog) {}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  updateComentarios(newComentario: string): void {
    this.group.get('comentarios')?.setValue(newComentario); // Actualiza el valor
    console.log('Comentario actualizado:', newComentario); // Imprimir el nuevo comentario
  }
  
  get tieneComentarios(): boolean {
    return this.historialComentariosList && this.historialComentariosList.length > 0;
  }
  

  openCommentDialog(): void {
    this.matDialog.open(CommentDialogComponent, {
      width: '600px',
      height: 'auto',
      data: {
        gestorCargaId: this.gestorCargaId,
        lista: this.historialComentariosList
      },
    }).afterClosed().subscribe((result: string) => {
      if (result) {
        this.updateComentarios(result);  // Actualiza el comentario en el formulario
      }
    });
  }
  

  private getListByCamionIdAndSemiId(
    camionId?: number,
    semiId?: number
  ): void {
    if (camionId && semiId) {
      this.camionSemiNetoService
        .getListByCamionIdAndSemiId(
          camionId,
          semiId
        )
        .subscribe((camionSemiNeto) => {
          this.neto = camionSemiNeto?.neto;
          this.cantidadNominadaControl.setValidators([
            NumberValidator.max(this.neto ?? 0),
            Validators.required,
          ]);
          this.cantidadNominadaControl.updateValueAndValidity();
          if (this.neto) {
            this.netoChange.emit(numberWithCommas(this.neto));
          }
        });
    }
  }
}
