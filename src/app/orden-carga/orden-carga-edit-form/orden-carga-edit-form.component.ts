import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  PermisoAccionEnum as a,
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { AuditDatabase } from 'src/app/interfaces/audit-database';
import { CombinacionList } from 'src/app/interfaces/combinacion';
import { FleteList } from 'src/app/interfaces/flete';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { OrdenCargaAnticipoRetirado } from 'src/app/interfaces/orden-carga-anticipo-retirado';
import { OrdenCargaComplemento } from 'src/app/interfaces/orden-carga-complemento';
import { OrdenCargaDescuento } from 'src/app/interfaces/orden-carga-descuento';
import { OrdenCargaEstadoHistorial } from 'src/app/interfaces/orden-carga-estado-historial';
import { OrdenCargaRemisionDestino } from 'src/app/interfaces/orden-carga-remision-destino';
import { OrdenCargaRemisionOrigen } from 'src/app/interfaces/orden-carga-remision-origen';
import { OrdenCargaRemisionResultado } from 'src/app/interfaces/orden-carga-remision-resultado';
import { DialogService } from 'src/app/services/dialog.service';
import { OrdenCargaService } from 'src/app/services/orden-carga.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { PdfPreviewDialogComponent } from '../pdf-preview-dialog/pdf-preview-dialog.component';
import { ReportsService } from 'src/app/services/reports.service';
import { PdfPreviewConciliarDialogComponent } from '../pdf-preview-conciliar-dialog/pdf-preview-conciliar-dialog.component';
import { EvaluacionesDialogComponent } from 'src/app/dialogs/evaluaciones-dialog/evaluaciones-dialog.component';

@Component({
  selector: 'app-orden-carga-edit-form',
  templateUrl: './orden-carga-edit-form.component.html',
  styleUrls: ['./orden-carga-edit-form.component.scss'],
})
export class OrdenCargaEditFormComponent implements OnInit, OnDestroy {
  a = PermisoAccionEnum;
  isButtonActive: boolean = true;
  id!: number;
  isCreate = false;
  isEdit = false;
  isCombinacionTouched = true;
  isInfoTouched = false;
  isTramoTouched = false;
  isActive = false;
  backUrl = `/orden-carga/${m.ORDEN_CARGA}/${a.LISTAR}`;
  modelo = m.ORDEN_CARGA;
  item?: OrdenCarga;
  flete?: FleteList;
  combinacionList?: CombinacionList;
  formDisabledTime = new Date();
  combinacionId?: number;
  originalComentario: string | null = null;
  puedeCrearRemision: boolean = false
  form = this.fb.group({
    combinacion: this.fb.group({
      flete_id: [null, Validators.required],
      camion_id: [null, Validators.required],
      combinacion_id: [null, Validators.required],
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
      pedido_id: null,
      numero_lote: null,
      saldo: null,
      cliente: null,
      producto_descripcion:null,
      origen_nombre: null,
      destino_nombre:null,
      tipo_flete: null,
      a_pagar: null,
      valor: null,
      neto: null,
      cant_origen: null,
      cant_destino: null,
      diferencia: null,
      anticipo_propietario: null,
      anticipo_chofer: null,
      puede_recibir_anticipos: null,
      estado: null,
      porcentaje_anticipos: null,
      anticipos: null,
      id_orden_carga: null,
      
    }),
    info: this.fb.group({
      cantidad_nominada: [null, Validators.required],
      comentarios: null,
      producto_descripcion: null,
    }),
  });

  initialFormValue = this.form.value;
  hasChange = false;
  hasChangeSubscription = this.form.valueChanges.subscribe((value) => {
    setTimeout(() => {
      this.hasChange = !isEqual(this.initialFormValue, value);
    });
  });

  get isShow(): boolean {
    return !this.isEdit;
  }

  get isNuevo(): boolean {
    return this.estado === EstadoEnum.NUEVO;
  }  
  

  get estado(): EstadoEnum {
    return this.item!.estado;
  }

  get gestorCargaId(): number | undefined {
    return this.item?.gestor_carga_id;
  }

  get idOC(): number {
    const ocValue = this.form.get('combinacion.id_orden_carga')?.value;
    return ocValue;
  }

  get isAnticiposLiberados(): boolean {
    return this.item!.anticipos_liberados;
  }

  get isAceptado(): boolean {
    return this.estado === EstadoEnum.ACEPTADO;
  }

  get isFinalizado(): boolean {
    return this.estado === EstadoEnum.FINALIZADO;
  }

  get puedeModificar(): boolean {
    if (
      !this.isEdit ||
      !(
        this.estado === EstadoEnum.NUEVO ||
        this.estado === EstadoEnum.PENDIENTE ||
        this.item?.is_conciliado
      )
    ) {
      return false;
    }
    return this.userService.checkPermisoAndGestorCargaId(
      a.EDITAR,
      this.modelo,
      this.gestorCargaId
    );
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

  get combinacion(): FormGroup {
    return this.form.get('combinacion') as FormGroup;
  }

  get info(): FormGroup {
    return this.form.get('info') as FormGroup;
  }

  get porcentajeAnticipos(): FormArray {
    return this.form.get('porcentaje_anticipos') as FormArray;
  }

  get tramo(): FormGroup {
    return this.form.get('tramo') as FormGroup;
  }

  get anticipoList(): OrdenCargaAnticipoRetirado[] {
    return this.item!.anticipos.slice();
  }

  get complementoList(): OrdenCargaComplemento[] {
    return this.item!.complementos.slice();
  }

  get descuentoList(): OrdenCargaDescuento[] {
    return this.item!.descuentos.slice();
  }

  get auditorias(): AuditDatabase[] {
    return this.item!.auditorias.slice();
  }

  get historialList(): OrdenCargaEstadoHistorial[] {
    return this.item!.historial.slice();
  }

  get movimientoList(): Movimiento[] {
    return this.item!.movimientos.slice();
  }

  get remisionDestinoList(): OrdenCargaRemisionDestino[] {
    return this.item!.remisiones_destino.slice();
  }

  get remisionOrigenList(): OrdenCargaRemisionOrigen[] {
    return this.item!.remisiones_origen.slice();
  }

  get remisionResultadoList(): OrdenCargaRemisionResultado[] {
    return this.item!.remisiones_resultado.slice();
  }

  get remisionResultadoFleteList(): OrdenCargaRemisionResultado[] {
    return this.item!.remisiones_resultado_flete.slice();
  }

  get created_by(): string {
    return this.item!.created_by;
  }

  get created_at(): string {
    return this.item!.created_at;
  }

  get modified_by(): string {
    return this.item!.modified_by;
  }

  get modified_at(): string {
    return this.item!.modified_at;
  }

  constructor(
    private fb: FormBuilder,
    private ordenCargaService: OrdenCargaService,
    private userService: UserService,
    private snackbar: SnackbarService,
    private route: ActivatedRoute,
    private router: Router,
    private chRef: ChangeDetectorRef,
    private dialog: DialogService,
    private snackBar: MatSnackBar,
    private reportsService: ReportsService,
  ) {}

  ngOnInit(): void {
    if (!this.hasChangeSubscription) {
      this.hasChangeSubscription = this.form.valueChanges.subscribe((value) => {
        setTimeout(() => {
          this.hasChange = !isEqual(this.initialFormValue, value);
        });
      });
    }
    this.getData();
    
  }
  

  ngOnDestroy(): void {
    this.hasChangeSubscription.unsubscribe();
  }

  redirectToEdit(): void {
    this.router.navigate([
      `/orden-carga/${m.ORDEN_CARGA}/${a.EDITAR}`,
      this.id,
    ]);
  }

  back(confirmed: boolean): void {
    // Obtener el valor actual del comentario y convertirlo a mayúsculas
    let comentario = this.form.get('info.comentarios')?.value;
    if (comentario) {
      comentario = comentario.toUpperCase();
    }
  
    // Comparar el valor actual del comentario con el valor original
    if (comentario !== this.originalComentario) {
      // Solicitar confirmación antes de aplicar los cambios
      const confirmation = window.confirm('¿Estás seguro de aplicar los cambios antes de salir?');
  
      if (confirmation) {
        // Guardar el comentario en mayúsculas antes de navegar
        this.ordenCargaService.updateComentarios(this.idOC, comentario).subscribe(
          () => {
            // Actualizar los datos después de guardar el comentario
            this.getData();
  
            // Navegar después de actualizar los datos
            this.router.navigate([this.backUrl]);
          },
          (error) => {
            // Mostrar mensaje de error si algo sale mal
            this.snackBar.open('Error al guardar el comentario', 'Cerrar', {
              duration: 3000, // Duración del mensaje
              verticalPosition: 'top',
              horizontalPosition: 'center',
            });
          }
        );
      } else {
        // Si el usuario cancela, simplemente navega a la URL de retorno
        this.router.navigate([this.backUrl]);
      }
    } else {
      // Navegar directamente si no hay cambios en el comentario
      this.router.navigate([this.backUrl]);
    }
  }
  

  onFleteChange(flete: FleteList | undefined): void {
    if (flete) {
      this.flete = flete;
      this.chRef.detectChanges();
    }
  }

  onCombinacionChange(combinacionList: CombinacionList | undefined): void {
    if (combinacionList) {
      this.combinacionList = combinacionList;
      this.chRef.detectChanges();
    }
  }

  aceptar(): void {
    if (this.idOC !== null && this.idOC !== undefined) {
      const comentario = this.form.get('info.comentarios')?.value;
      const comentarioUpper = comentario ? comentario.toUpperCase() : '';
  
      if (comentarioUpper) {
        this.ordenCargaService.updateComentarios(this.idOC, comentarioUpper).subscribe(() => {
          this.dialog.confirmation(
            '¿Está seguro que desea aceptar la Orden de Carga?',
            () => {
              this.ordenCargaService.aceptar(this.idOC as number).subscribe(
                () => {
                  this.snackbar.open('Estado cambiado satisfactoriamente');
                  this.puedeCrearRemision = true; 
                  this.form.get('info.comentarios')?.disable();
                },
                (error) => {
                  console.error('Error al aceptar la orden de carga:', error);
                }
              );
            }
          );
        });
      } else {
        this.dialog.confirmation(
          '¿Está seguro que desea aceptar la Orden de Carga?',
          () => {
            this.ordenCargaService.aceptar(this.idOC as number).subscribe(
              () => {
                this.snackbar.open('Estado cambiado satisfactoriamente');
                this.puedeCrearRemision = true; 
                this.form.get('info.comentarios')?.disable();
              },
              (error) => {
                console.error('Error al aceptar la orden de carga:', error);
              }
            );
          }
        );
      }
    } else {
      console.error('No se puede aceptar la orden de carga sin un ID válido');
    }
  }


  finalizar(): void {
    if (this.idOC !== null && this.idOC !== undefined) {
      if (this.item?.estado === 'Finalizado') {
        alert('La Orden de Carga ya está finalizada.');
        return;
      }
  
      const comentario = this.form.get('info.comentarios')?.value;
      const comentarioUpper = comentario ? comentario.toUpperCase() : '';
  
      if (comentarioUpper) {
        this.ordenCargaService.updateComentarios(this.idOC, comentarioUpper).subscribe(() => {
          // Abrir el modal sin mensaje
          const dialogRef = this.dialog.open(EvaluacionesDialogComponent, {
            width: '300px'
          });
  
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              // Si el usuario selecciona "Guardar", finalizar la orden de carga
              this.ordenCargaService.finalizar(this.idOC).subscribe(() => {
                this.getData();
                this.form.get('info.comentarios')?.disable();
                this.snackBar.open('Generando PDF...', 'Cerrar', {
                  duration: 3000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center'
                });
                this.downloadResumenPDF();
              });
            } else {
              // Si el usuario selecciona "Cancelar"
              console.log('La finalización ha sido cancelada.');
            }
          });
        });
      } else {
        // Si no hay comentarios, abrir el modal sin mensaje
        const dialogRef = this.dialog.open(EvaluacionesDialogComponent, {
          width: '300px'
        });
  
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.ordenCargaService.finalizar(this.idOC).subscribe(() => {
              this.getData();
              this.form.get('info.comentarios')?.disable();
              this.snackBar.open('Generando PDF...', 'Cerrar', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'center'
              });
              this.downloadResumenPDF();
            });
          } else {
            console.log('La finalización ha sido cancelada.');
          }
        });
      }
    } else {
      console.error('No se puede finalizar sin un ID válido.');
    }
  }


  cancelar(): void {
    if (this.idOC !== null && this.idOC !== undefined) {
      const comentario = this.form.get('info.comentarios')?.value;
      const comentarioUpper = comentario ? comentario.toUpperCase() : '';
  
      if (comentarioUpper) {
        this.ordenCargaService.updateComentarios(this.idOC, comentarioUpper).subscribe(() => {
          this.dialog.changeStatusConfirm(
            '¿Está seguro que desea cancelar la Orden de Carga?',
            this.ordenCargaService.cancelar(this.idOC),
            () => {
              this.form.get('info.comentarios')?.disable();
              this.getData();
            }
          );
        });
      } else {
        this.dialog.changeStatusConfirm(
          '¿Está seguro que desea cancelar la Orden de Carga?',
          this.ordenCargaService.cancelar(this.idOC),
          () => {
            this.form.get('info.comentarios')?.disable();
            this.getData();
          }
        );
      }
    } else {
      console.error('No se puede cancelar la Orden de Carga sin un ID válido');
    }
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
        this.ordenCargaService.updateComentarios(this.idOC, comentarioUpper).subscribe(() => {
          this.dialog.changeStatusConfirm(
            '¿Está seguro que desea conciliar la Orden de Carga?',
            this.ordenCargaService.conciliar(this.idOC),
            () => {
              this.getData();
              this.form.get('info.comentarios')?.disable();
              this.snackBar.open('Generando PDF...', 'Cerrar', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'center'
              });
              this.downloadResumenPDFConciliado();
            }
          );
        });
      } else {
        this.dialog.changeStatusConfirm(
          '¿Está seguro que desea conciliar la Orden de Carga?',
          this.ordenCargaService.conciliar(this.idOC),
          () => {
            this.getData();
            this.form.get('info.comentarios')?.disable();
            this.snackBar.open('Generando PDF...', 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
            this.downloadResumenPDFConciliado();
          }
        );
      }
    } else {
      console.error('No se puede conciliar la Orden de Carga sin un ID válido');
    }
  }
  
  
  downloadResumenPDF(): void {
    this.ordenCargaService.resumenPdf(this.idOC).subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        const blob = new Blob([file], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        this.dialog.open(PdfPreviewDialogComponent, {
          width: '80%',
          height: '80%',
          data: {
            pdfUrl: url,
            fileBlob: blob, 
            filename: filename 
          }
        });
      });
    });
  }
  
  downloadResumenPDFConciliado(): void {
    this.ordenCargaService.resumenPdf(this.idOC).subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        const blob = new Blob([file], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        this.dialog.open(PdfPreviewConciliarDialogComponent, {
          width: '80%',
          height: '80%',
          data: {
            pdfUrl: url,
            fileBlob: blob, 
            filename: filename 
          }
        });
      });
    });
  }


  submit(confirmed: boolean): void {
    this.isInfoTouched = false;
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const formData = new FormData();
      const data = JSON.parse(
        JSON.stringify({
          ...this.info.value,
          ...this.tramo.value,
          ...this.combinacion.value,
          ...this.combinacion.value,
          porcentaje_anticipos: this.porcentajeAnticipos.value,
        })
      );
      // Convertir propiedades a mayúsculas, excepto los correos electrónicos
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string' && key !== 'email') {
          data[key] = data[key].toUpperCase();
        }
      });   
      formData.append('data', JSON.stringify(data));
      if (this.isEdit) {
        this.hasChange = false;
        this.initialFormValue = this.form.value;
        this.ordenCargaService.edit(this.id, formData).subscribe(() => {
          this.snackbar.openUpdateAndRedirect(confirmed, this.backUrl);
          this.getData();
        });
      }
    } else {
      setTimeout(() => {
        this.isInfoTouched = this.info.invalid;
        this.isTramoTouched = this.tramo.invalid;
        this.isCombinacionTouched = this.combinacion.invalid;
      });
    }
  }

  active(): void {
    this.dialog.changeStatusConfirm(
      '¿Está seguro que desea liberar anticipos?',
      this.ordenCargaService.modificarAnticipos(this.id!),
      () => {
        this.getData();
      }
    );
  }

  inactive(): void {
    this.dialog.changeStatusConfirm(
      '¿Está seguro de bloquear Anticipos?',
      this.ordenCargaService.modificarAnticipos(this.id!),
      () => {
        this.getData();
      }
    );
  }

  get isToggleAnticiposLiberados(): boolean {
    return this.item ? this.item.anticipos_liberados : false;
  }

  get toggleIcon(): string {
    return this.anticipoList ? 'toggle_on' : 'toggle_off';
  }

  getData(): void {
    const backUrl = this.route.snapshot.queryParams.backUrl;
    if (backUrl) {
      this.backUrl = backUrl;
    }
    this.id = +this.route.snapshot.params.id;
    this.isEdit = /edit/.test(this.router.url);
   
    this.ordenCargaService.getById(this.id).subscribe((data) => {
      this.item = data;
    
      this.isActive = data.estado === EstadoEnum.NUEVO;
      this.form.patchValue({
        combinacion: {
          flete_id: data.flete_id,
          camion_id: data.camion_id,
          combinacion_id: data.combinacion_id,
          marca_camion: data.camion_marca,
          color_camion: data.camion_color,
          semi_id: data.semi_id,
          semi_placa: data.semi_placa,
          marca_semi: data.semi_marca,
          color_semi: data.semi_color,
          propietario_camion: data.camion_propietario_nombre,
          propietario_camion_doc: data.camion_propietario_documento,
          chofer_camion: data.camion_chofer_nombre,
          chofer_camion_doc: data.combinacion_chofer_doc,
          beneficiario_camion: data.camion_beneficiario_nombre,
          beneficiario_camion_doc: data.camion_beneficiario_documento,
          numero: data.flete_numero_lote,
          saldo: data.camion_total_anticipos_retirados_en_estado_pendiente_o_en_proceso,
          cliente: data.flete_remitente_nombre,
          tipo_flete: data.flete_tipo,
          producto_descripcion: data.flete_producto_descripcion,
          origen_nombre: data.flete_origen_nombre,
          destino_nombre: data.flete_destino_nombre,
          a_pagar: data.condicion_gestor_cuenta_tarifa,
          neto: data.neto,
          valor: data.flete_monto_efectivo,
          cant_origen: data.cantidad_origen,
          cant_destino: data.cantidad_destino,
          diferencia: data.diferencia_origen_destino,
          anticipo_chofer: data.camion_chofer_puede_recibir_anticipos,
          estado: data.estado,
          anticipos: data.anticipos_liberados,
          id_orden_carga: data.id
        },
        info: {
          cantidad_nominada: data.cantidad_nominada,
          comentarios: data.comentarios,
        },
        tramo: {
          flete_origen_id: data.flete_origen_id,
          flete_destino_id: data.flete_destino_id,
          origen_id: data.flete_origen_nombre,
          destino_id: data.flete_destino_nombre,
        },
        
      });
      this.originalComentario = data.comentarios ?? null;
      this.form.disable();
      this.form.get('info.comentarios')?.enable();
     
      setTimeout(() => {
        this.hasChange = false;
        this.initialFormValue = this.form.value;
      }, 500);
    });
  }
}
