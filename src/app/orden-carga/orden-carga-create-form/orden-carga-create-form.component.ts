import { Component, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { isEqual } from 'lodash';
import { filter } from 'rxjs/operators';
import { CommentDialogComponent } from 'src/app/dialogs/comment-dialog/comment-dialog.component';
import { EvaluacionesCancelarComponent } from 'src/app/dialogs/evaluaciones-cancelar/evaluaciones-cancelar.component';
import { EvaluacionesDialogComponent } from 'src/app/dialogs/evaluaciones-dialog/evaluaciones-dialog.component';
import { OcConfirmationDialogComponent } from 'src/app/dialogs/oc-confirmation-dialog/oc-confirmation-dialog.component';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as r,
} from 'src/app/enums/permiso-enum';
import { getOCData } from 'src/app/form-data/oc-confirmation-data';
import { Camion, CamionList } from 'src/app/interfaces/camion';
import { Combinacion, CombinacionList } from 'src/app/interfaces/combinacion';
import { FleteList } from 'src/app/interfaces/flete';
import { OCConfirmationDialogData } from 'src/app/interfaces/oc-confirmation-dialog-data';
import { OrdenCarga, OrdenCargaList } from 'src/app/interfaces/orden-carga';
import { OrdenCargaAnticipoRetirado } from 'src/app/interfaces/orden-carga-anticipo-retirado';
import { OrdenCargaComplemento } from 'src/app/interfaces/orden-carga-complemento';
import { OrdenCargaDescuento } from 'src/app/interfaces/orden-carga-descuento';
import { OrdenCargaRemisionDestino } from 'src/app/interfaces/orden-carga-remision-destino';
import { OrdenCargaRemisionOrigen } from 'src/app/interfaces/orden-carga-remision-origen';
import { OrdenCargaComentariosHistorial } from 'src/app/interfaces/orden_carga_comentarios_historial';
import { Semi } from 'src/app/interfaces/semi';
import { DialogService } from 'src/app/services/dialog.service';
import { OrdenCargaService } from 'src/app/services/orden-carga.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StateService } from 'src/app/services/state.service';
import { UserService } from 'src/app/services/user.service';
import { PdfPreviewDialogComponent } from '../pdf-preview-dialog/pdf-preview-dialog.component';
import { PdfPreviewConciliarDialogComponent } from '../pdf-preview-conciliar-dialog/pdf-preview-conciliar-dialog.component';
import { OrdenCargaRemisionResultado } from 'src/app/interfaces/orden-carga-remision-resultado';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { OrdenCargaEstadoHistorialDialogComponent } from 'src/app/dialogs/orden-carga-estado-historial-dialog/orden-carga-estado-historial-dialog.component';
import { OrdenCargaEstadoHistorial } from 'src/app/interfaces/orden-carga-estado-historial';

@Component({
  selector: 'app-orden-carga-create-form',
  templateUrl: './orden-carga-create-form.component.html',
  styleUrls: ['./orden-carga-create-form.component.scss'],
})
export class OrdenCargaCreateFormComponent implements OnInit {
  flete?: FleteList;

  ordenCarga?: OrdenCargaList;
  isFormSubmitting = true;
  isCreate=true;
  backUrl = `/orden-carga/${m.ORDEN_CARGA}/${a.LISTAR}`;
  modelo = m.ORDEN_CARGA;
  id?: number;
  camion?: Camion;
  semi?: Semi;
  combinacionList?: CombinacionList
  isFormSaved: boolean = false;
  ordenCargaId: number | null = null;
  item?: OrdenCarga;
  isActive = false;
  fleteId?: number;
  dataFromParent: string = 'Nuevo';
  isEdit = false;
  isNeto = true;
  originalComentario: string | null = null;
  form = this.fb.group({
    combinacion: this.fb.group({
      flete_id: [null  , Validators.required],
      camion_id: [null, Validators.required],
      camion_placa: null,
      combinacion_id: [null, Validators.required],
      chofer_id: null,
      propietario_id: null,
      marca_camion: null,
      color_camion: null,
      propietario_camion: null,
      propietario_camion_doc: null,
      chofer_camion: null,
      chofer_camion_doc: null,
      beneficiario_camion: null,
      beneficiario_camion_doc: null,
      semi_id: [null, Validators.required],
      semi_placa: null,
      marca_semi: null,
      color_semi: null,
      estado: null,
      pedido_id: null,
      numero_lote: null,
      saldo: null,
      cliente: null,
      producto_descripcion: null,
      origen_nombre: null,
      destino_nombre:null,
      tipo_flete: null,
      a_pagar: null,
      valor: null,
      neto: null,
      cant_origen: null,
      cant_destino: null,
      diferencia: null,
      puede_recibir_anticipos: [false],
      anticipo_propietario: null,
      anticipos: null,
      id_orden_carga: null,
    }),
    info: this.fb.group({
      cantidad_nominada: [null, Validators.required],
      comentarios: null,
    }),

  });

  initialFormValue = this.form.value;
  hasChange = false;
  hasChangeSubscription = this.form.valueChanges.subscribe((value) => {
    setTimeout(() => {
      this.hasChange = !isEqual(this.initialFormValue, value);
    });
  });

  get estadoOc() {
    const estadoValue = this.form.get('combinacion.estado')?.value;
    return estadoValue;
  }

  get estado(): EstadoEnum {
    return this.item!.estado;
  }

  get idOC(): number {
    const ocValue = this.form.get('combinacion.id_orden_carga')?.value;
    return ocValue;
  }

  get combinacion(): FormGroup {
    return this.form.get('combinacion') as FormGroup;
  }

  get info(): FormGroup {
    return this.form.get('info') as FormGroup;
  }

  get anticipoList(): OrdenCargaAnticipoRetirado[]{
    return this.item!?.anticipos.slice();
  }

  get comentariosList(): OrdenCargaComentariosHistorial[]{
    return this.item!?.comentario.slice();
  }

  get remisionDestinoList(): OrdenCargaRemisionDestino[] {
    return this.item!?.remisiones_destino.slice();
  }

  get remisionOrigenList(): OrdenCargaRemisionOrigen[] {
    return this.item!?.remisiones_origen.slice();
  }

  get complementoList(): OrdenCargaComplemento[] {
    return this.item!?.complementos.slice();
  }

  get descuentoList(): OrdenCargaDescuento[] {
    return this.item!?.descuentos.slice();
  }

  get remisionResultadoList(): OrdenCargaRemisionResultado[] {
    return this.item!?.remisiones_resultado.slice();
  }

  get movimientoList(): Movimiento[] {
    return this.item!?.movimientos.slice();
  }


  get porcentajeAnticipos(): FormArray {
    return this.form.get('porcentaje_anticipos') as FormArray;
  }

  get gestorCargaId(): number | undefined {
    return this.item?.gestor_carga_id;
  }

  get isFinalizado(): boolean {
    return this.estado === EstadoEnum.FINALIZADO;
  }

  get historialList(): OrdenCargaEstadoHistorial[] {
    return this.item!?.historial.slice();
  }

  get isShow(): boolean {
    return !this.isEdit;
  }

  isViewMode: boolean = true;

  get isAnticiposLiberados(): boolean {
    return this.item!?.anticipos_liberados;
  }

  get puedeConciliar(): boolean {
    return (
      this.userService.checkPermisoAndGestorCargaId(
        a.CONCILIAR,
        this.modelo,
        this.gestorCargaId
      ) && this.isFinalizado
    );
  }

  get puedeCambiarEstado(): boolean {
    const permiso = this.userService.checkPermisoAndGestorCargaId(
      a.CAMBIAR_ESTADO,
      this.modelo,
      this.gestorCargaId
    );
    return permiso;
  }


  ngOnInit(): void {
    this.setInitialToggleState();
    const gestorCargaId = this.gestorCargaId;
    if (gestorCargaId !== undefined) {
      this.dataFromParent = this.userService.checkPermisoAndGestorCargaId(
        a.CAMBIAR_ESTADO,
        this.modelo,
        gestorCargaId
      ) ? 'Aceptado' : 'Nuevo';
    } else {
      this.dataFromParent = 'Nuevo';
    }

  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: DialogService,
    private snackbar: SnackbarService,
    private ordenCargaService: OrdenCargaService,
    private userService: UserService,
    private matDialog: MatDialog ,
    private stateService: StateService,
    private snackBar: MatSnackBar,
    private reportsService: ReportsService,
  ) {}

  redirectToEdit(): void {
    this.router.navigate([
      `/orden-carga/${m.ORDEN_CARGA}/${a.EDITAR}`,
      this.id,
    ]);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(OrdenCargaEstadoHistorialDialogComponent, {
      width: '800px',
      data: {
        gestorCargaId: this.gestorCargaId,
        lista: this.historialList
      },
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  setInitialToggleState(): void {
    if (this.item && this.item.anticipos_liberados) {
      this.isActive = this.item.anticipos_liberados;
    }
  }

  back(confirmed: boolean): void {
    if (confirmed) {
      this.save(confirmed);
    } else {
      this.router.navigate([this.backUrl]);
    }
  }

  active(): void {
    if (this.ordenCargaId !== null) {
      this.dialog.changeStatusConfirm(
        '¿Está seguro que desea liberar anticipos?',
        this.ordenCargaService.modificarAnticipos(this.ordenCargaId),
        () => {
          this.getData();
        }
      );
    } else {
      console.error('No se puede activar anticipos sin un ID válido');
    }
  }

  inactive(): void {
    if (this.ordenCargaId !== null) {
      this.dialog.changeStatusConfirm(
        '¿Está seguro que desea bloquear anticipos?',
        this.ordenCargaService.modificarAnticipos(this.ordenCargaId),
        () => {
          this.getData();
        }
      );
    } else {
      console.error('No se puede bloquear anticipos sin un ID válido');
    }
  }

  get isToggleAnticiposLiberados(): boolean {
    return this.item ? this.item.anticipos_liberados : false;
  }

  cancelar(): void {
    if (this.idOC !== null && this.idOC !== undefined) {
        const comentario = this.form.get('info.comentarios')?.value?.toUpperCase() || '';
        if (comentario !== this.originalComentario) {
            this.createComentarioAndCancel(comentario);
        } else {
            this.cancelOrdenCarga();
        }
    } else {
        console.error('No se puede cancelar la Orden de Carga sin un ID válido');
    }
  }

  private createComentarioAndCancel(comentario: string): void {
      const formData = new FormData();
      const data = {
          orden_carga_id: this.idOC,
          comentario: comentario,
      };
      formData.append('data', JSON.stringify(data));

      this.ordenCargaService.createComentarios(formData).subscribe(
          () => {
              this.cancelOrdenCarga();
          },
          (error) => {
              console.error('Error al crear el comentario', error);
          }
      );
  }

  private cancelOrdenCarga(): void {
    this.dialog.changeStatusConfirm(
        '¿Está seguro que desea cancelar la Orden de Carga?',
        this.ordenCargaService.cancelar(this.idOC),
        () => {
            this.getData();

            // Abre el diálogo de evaluación
            const dialogRef = this.openEvaluacionesCancelarDialog();

            dialogRef.afterClosed().subscribe(result => {
                if (result) { // Si se acepta el diálogo
                    // Genera el PDF después de que el diálogo se haya cerrado
                    this.snackBar.open('Generando PDF...', 'Cerrar', {
                        duration: 3000,
                        verticalPosition: 'top',
                        horizontalPosition: 'center'
                    });
                    this.downloadResumenPDF();
                } else {
                    // console.log('Diálogo de evaluación cancelado');
                }
            });
        },
    );
}

  finalizar(): void {
    if (this.idOC !== null && this.idOC !== undefined) {
        if (this.item?.estado === 'Finalizado') {
            alert('La Orden de Carga ya está finalizada.');
            return;
        }

        const comentario = this.form.get('info.comentarios')?.value?.toUpperCase() || '';
        if (comentario !== this.originalComentario) {
            this.createComentarioAndFinalize(comentario);
        } else {
            this.finalizeOrdenCarga();
        }
    } else {
        console.error('No se puede finalizar la Orden de Carga sin un ID válido');
    }
  }

  openEvaluacionesDialog(): MatDialogRef<EvaluacionesDialogComponent> {
    return this.dialog.open(EvaluacionesDialogComponent, {
      data: {
        orden_carga_id: this.item?.id,
        camion_id: this.item?.camion_id,
        semi_id: this.item?.semi_id,
        propietario_id: this.item?.combinacion_propietario_id,
        chofer_id: this.item?.combinacion_chofer_id,
        gestor_carga_id: this.item?.gestor_carga_id,
        origen_id: this.item?.origen_id,
        destino_id: this.item?.destino_id,
        producto_id: this.item?.flete_producto_id
      },
      width: '30rem',
      height: 'auto',
      panelClass: 'custom-dialog-container'
    });
  }

  openEvaluacionesCancelarDialog(): MatDialogRef<EvaluacionesCancelarComponent> {
    return this.dialog.open(EvaluacionesCancelarComponent, {
      data: {
        orden_carga_id: this.item?.id,
        camion_id: this.item?.camion_id,
        semi_id: this.item?.semi_id,
        propietario_id: this.item?.combinacion_propietario_id,
        chofer_id: this.item?.combinacion_chofer_id,
        gestor_carga_id: this.item?.gestor_carga_id,
        origen_id: this.item?.origen_id,
        destino_id: this.item?.destino_id,
        producto_id: this.item?.flete_producto_id
      },
      width: '30rem',
      height: 'auto',
      panelClass: 'custom-dialog-container'
    });
  }

  private createComentarioAndFinalize(comentario: string): void {
      const formData = new FormData();
      const data = {
          orden_carga_id: this.idOC,
          comentario: comentario,
      };
      formData.append('data', JSON.stringify(data));

      this.ordenCargaService.createComentarios(formData).subscribe(
          () => {
              this.finalizeOrdenCarga();
          },
          (error) => {

          }
      );
  }

  private finalizeOrdenCarga(): void {
      this.dialog.changeStatusConfirm(
          '¿Está seguro que desea finalizar la Orden de Carga?',
          this.ordenCargaService.finalizar(this.idOC),
          () => {
              this.getData();
              const dialogRef = this.openEvaluacionesDialog();

              dialogRef.afterClosed().subscribe(result => {
                  if (result) {
                      this.snackBar.open('Generando PDF...', 'Cerrar', {
                          duration: 3000,
                          verticalPosition: 'top',
                          horizontalPosition: 'center'
                      });
                      this.downloadResumenPDF();
                  } else {
                  }
              });
          },
      );
  }

  conciliar(): void {
    if (this.idOC !== null && this.idOC !== undefined) {
      if (this.item?.estado === 'Conciliado') {
        alert('La Orden de Carga ya está conciliada.');
        return;
      }

      const comentario = this.form.get('info.comentarios')?.value;
      const comentarioUpper = comentario ? comentario.toUpperCase() : '';

      if (comentarioUpper) {
        this.createComentarioYConciliar(comentarioUpper);
      } else {
        this.conciliarOrdenCarga();
      }
    } else {
      console.error('No se puede conciliar la Orden de Carga sin un ID válido');
    }
  }

  private createComentarioYConciliar(comentario: string): void {
    const formData = new FormData();
    const data = {
      orden_carga_id: this.idOC,
      comentario: comentario,
    };
    formData.append('data', JSON.stringify(data));

    this.ordenCargaService.createComentarios(formData).subscribe(() => {
      this.conciliarOrdenCarga();
    }, error => {
      console.error('Error al crear el comentario', error);
    });
  }

  private conciliarOrdenCarga(): void {
    this.dialog.changeStatusConfirm(
        '¿Está seguro que desea conciliar la Orden de Carga?',
        this.ordenCargaService.conciliar(this.idOC),
        () => {
            this.getData();
            this.form.get('info.comentarios')?.disable();
            const dialogRef = this.openEvaluacionesDialog();

            dialogRef.afterClosed().subscribe(result => {
                if (result) { // Si se acepta el diálogo
                    const comentario = this.form.get('info.comentarios')?.value;
                    const comentarioUpper = comentario ? comentario.toUpperCase() : '';

                    if (comentarioUpper) {
                        this.createComentarioYConciliar(comentarioUpper);
                    }
                } else {
                    // console.log('Diálogo de evaluación cancelado');
                }
                this.snackBar.open('Generando PDF...', 'Cerrar', {
                    duration: 3000,
                    verticalPosition: 'top',
                    horizontalPosition: 'center'
                });
                this.downloadConciliarResumenPDF();
            });
        },

    );
  }

  downloadResumenPDF(): void {
    this.ordenCargaService.resumenPdf(this.idOC).subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        const blob = new Blob([file], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        this.dialog.open(PdfPreviewDialogComponent, {
          width: '90%',
          height: '90%',
          data: {
            pdfUrl: url,
            fileBlob: blob,
            filename: filename
          }
        });
      });
    });
  }

  downloadConciliarResumenPDF(): void {
    this.ordenCargaService.resumenPdf(this.idOC).subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        const blob = new Blob([file], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        this.dialog.open(PdfPreviewConciliarDialogComponent, {
          width: '90%',
          height: '90%',
          data: {
            pdfUrl: url,
            fileBlob: blob,
            filename: filename
          }
        });
      });
    });
  }


  save(confirmed: boolean): void {

    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {

      this.isNeto = false
      const comentarios = this.item?.comentario || [];
      const data: OCConfirmationDialogData = {
        oc: getOCData(this.form, this.flete, this.combinacionList,  this.form.get('combinacion')?.get('neto')?.value),
        comentarios: comentarios
      };

      this.dialog
        .open(OcConfirmationDialogComponent, {
          data,
          panelClass: 'selector-dialog',
          position: {
            top: '1rem',
          },
        })
        .afterClosed()
        .pipe(filter((confirmed: any) => !!confirmed))
        .subscribe(() => {
          this.submit(confirmed);
        });
    }
  }


  submit(confirmed: boolean): void {
    if (this.form.valid) {
      this.isFormSaved = true;
      this.isFormSubmitting = false;
      this.dataFromParent = this.form.get('combinacion.estado')?.value;
    }
    const formData = new FormData();
    const data = JSON.parse(
      JSON.stringify({
        ...this.combinacion.value,
        ...this.info.value,
      })
    );
    // Convertir propiedades a mayúsculas, excepto los correos electrónicos
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'string' && key !== 'email') {
        data[key] = data[key].toUpperCase();
      }
    });
  
    formData.append('data', JSON.stringify(data));
    
    this.ordenCargaService.create(formData).subscribe((item) => {
      this.snackbar.openSave();
      this.ordenCargaId = item.id;
      this.fleteId = item.flete_id;
      this.item = item;
      this.info.get('comentarios')?.setValue('');
      this.dataFromParent = item.estado;
       this.snackbar.openSaveAndRedirect(
         confirmed,
         this.backUrl,
         r.ORDEN_CARGA,
         m.ORDEN_CARGA,
         item.id
       );
    });
    this.form.disable();
  }

  getData(): void {
    if (!this.item) return
    this.ordenCargaService.getById(
      this.item.id).subscribe((data) => {
      this.item = data;
    });
  }
}
