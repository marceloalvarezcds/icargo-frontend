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

  private previousCamionId: number | null = null;
  private previousSemiId: number | null = null;

  @Input() disableForm: boolean = false;
  @Input() disabled: boolean | undefined;
  @Input() oc?: OrdenCarga;
  @Input() list: OrdenCargaComentariosHistorial[] = [];

  @Input() set form(f: FormGroup | undefined) {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Evitar suscripciones múltiples
    }
    this.formGroup = f;
    if (f) {
      this.subscription = this.combinacion.valueChanges
        .pipe(
          filter((c: Partial<OrdenCargaForm>) => !!(this.flete && c.combinacion_id))
        )
        .subscribe((c: Partial<OrdenCargaForm>) => {
          this.getListByCombinacionId(c.combinacion_id!);
        });
    }
    if (this.flete) {
      this.getListByCombinacionId(this.combinacionIdControl.value);
    }
  }

  @Input() set flete(f: FleteList | undefined) {
    this.fl = f;
    if (f) {
      this.getListByCombinacionId(this.combinacionIdControl.value);
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

  get combinacionIdControl(): FormControl {
    return this.combinacion.get('combinacion_id') as FormControl;
  }

  get productoId(): number | undefined {
    return this.flete ? this.flete.producto_id : undefined;
  }

  get historialComentariosList(): OrdenCargaComentariosHistorial[] {
    return this.oc!?.comentario.slice();
  }

  get gestorCargaId(): number | undefined {
    return this.oc!?.gestor_carga_id;
  }

  constructor(private combinacionService: CombinacionService, private matDialog: MatDialog) {}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  updateComentarios(newComentario: string): void {
    this.group.get('comentarios')?.setValue(newComentario);
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
        this.updateComentarios(result);
      }
    });
  }


  private getListByCombinacionId(camionId: number): void {
    if (this.previousCamionId !== camionId) {
      this.previousCamionId = camionId;
      this.combinacionService.getById(camionId).subscribe((combinacion) => {
        this.neto = combinacion?.neto;
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

