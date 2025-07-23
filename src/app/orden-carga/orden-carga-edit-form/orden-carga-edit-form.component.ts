import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { OrdenCarga, OrdenCargaList } from 'src/app/interfaces/orden-carga';
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
import { MatDialogRef } from '@angular/material/dialog';
import { EvaluacionesCancelarComponent } from 'src/app/dialogs/evaluaciones-cancelar/evaluaciones-cancelar.component';
import { OrdenCargaAnticipoSaldoService } from 'src/app/services/orden-carga-anticipo-saldo.service';
import { FleteAnticipo, FleteAnticipoForm } from 'src/app/interfaces/flete-anticipo';
import { InsumoPuntoVentaPrecioService } from 'src/app/services/insumo-punto-venta-precio.service';
import { OrdenCargaAnticipoSaldo, OrdenCargaAnticipoSaldoForm } from 'src/app/interfaces/orden-carga-anticipo-saldo';
import { FleteAnticipoService } from 'src/app/services/flete-anticipo.service';
import { OcRemitirDialogComponent } from 'src/app/dialogs/oc-remitir-dialog/oc-remitir-dialog.component';


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
  isEditPedido = false;
  isCombinacionTouched = true;
  isInfoTouched = false;
  isTramoTouched = false;
  isOc = true;
  isButtonPressed = false;
  isActive = false;
  backUrl = `/orden-carga/${m.ORDEN_CARGA}/${a.LISTAR}`;
  modelo = m.ORDEN_CARGA;
  item?: OrdenCarga;
  itemList?: OrdenCargaList
  flete?: FleteList;
  fleteAnticipo?: OrdenCargaAnticipoSaldo;
  fleteAnticipoForm?: OrdenCargaAnticipoSaldoForm;
  isEditPressed: boolean = true;
  combinacionList?: CombinacionList;
  formDisabledTime = new Date();
  combinacionId?: number;
  originalComentario: string | null = null;
  puedeCrearRemision: boolean = false;
  pdfSrc: string | undefined;
  form = this.fb.group({
    combinacion: this.fb.group({
      flete_id: [null, Validators.required],
      camion_id: [null, Validators.required],
      camion_placa: null,
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
      condicion: null,
      comentarios: null,
      unidad_id: null,
      moneda_id: null,
      is_chofer_condicionado: null,
      is_propietario_condicionado: null
    }),
    info: this.fb.group({
      cantidad_nominada: [null, Validators.required],
      producto_descripcion: null,
      documento_fisico:null,
    }),
  });

  colapseDivRemision = false;
  colapseDivResultado = false;
  colapseDivMovimiento = false;
  colapseDivComplementos = false;

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

  get isToggleAnticiposLiberados(): boolean {
    return this.item ? this.item.anticipos_liberados : false;
  }

  get toggleIcon(): string {
    return this.anticipoList ? 'toggle_on' : 'toggle_off';
  }

  get isConciliado(): boolean {
    return this.item?.estado === EstadoEnum.CONCILIADO;
  }

  get isCancelado(): boolean {
    return this.item?.estado === EstadoEnum.CANCELADO;
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

  get chofer_nombre(): string | undefined {
    return this.itemList?.camion_placa;
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

  get tieneDocumentoFisico(): FormControl {
    return this.info.get('documento_fisico') as FormControl;
  }

  get tieneDocumentoFisicoValue(): FormControl {
    return this.info.get('documento_fisico')?.value;
  }

  get felteIdValue(): FormControl {
    return this.info.get('combinacion.flete_id')?.value;
  }

  get anticipoFlete(): number | undefined | null {
    return this.fleteAnticipo?.flete_anticipo_id_property ?? null;
  }

  constructor(
    private fb: FormBuilder,
    private ordenCargaService: OrdenCargaService,
    private ordenCargaSaldoService: OrdenCargaAnticipoSaldoService,
    private insumoService: FleteAnticipoService,
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
    this.form.get('combinacion.flete_id')?.disable();
    this.form.get('combinacion.combinacion_id')?.disable();
    this.form.get('combinacion.id_orden_carga')?.disable();
    this.form.get('info.cantidad_nominada')?.disable()
    this.getData();

    //Control de pestanas
    window.addEventListener('storage', (event) => {
    if (event.key === 'orden_carga_actualizada') {
      const data = JSON.parse(event.newValue!);
      if (data?.ordenId === this.id) {
        this.getData(); // recarga la OC si coincide
      }
    }
    });

    window.addEventListener('storage', (event) => {
    if (event.key === 'anticipo_actualizado' || event.key === 'anticipo_insumo_actualizado') {
      const data = JSON.parse(event.newValue!);
      if (data?.ordenCargaId === this.item?.id) {
        this.getData(); // o this.anticipoTable.reload()
      }
    }
   });
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

  active(): void {
    let sms = "¿Está seguro que desea liberar anticipos?";

    if (this.item?.anticipos_liberados) {
      sms = '<p>¿Está seguro de bloquear Anticipos?. <br>'
          + 'Esta acción bloqueará los anticipos en esta OC</p>';
    }

    this.dialog.changeStatusConfirmHtml(
      '',
      sms,
      this.ordenCargaService.modificarAnticipos(this.id!),
      () => {
        this.getData();
        localStorage.setItem(
          'orden_carga_actualizada',
          JSON.stringify({ ordenId: this.id, timestamp: Date.now() })
        );
      }
    );
  }


  inactive(): void {
    this.dialog.changeStatusConfirmHtml(
      '',
      '<p>¿Está seguro de bloquear Anticipos?.<br>'
      + 'Esta acción bloqueará los anticipos en esta OC.</p>',
      this.ordenCargaService.modificarAnticipos(this.id!),
      () => {
        this.getData();
        localStorage.setItem(
          'orden_carga_actualizada',
          JSON.stringify({ ordenId: this.id, timestamp: Date.now() })
        );
      }
    );
  }



  // back(confirmed: boolean): void {
  //   if (confirmed) {
  //     this.submit(confirmed);
  //   } else {
  //     let comentario = this.form.get('combinacion.comentarios')?.value;

  //     // Convertir el comentario a mayúsculas si no está vacío
  //     if (comentario) {
  //       comentario = comentario.toUpperCase();
  //     }

  //     if (comentario !== this.originalComentario && comentario.trim() !== '') {
  //       const formData = new FormData();
  //       const data = {
  //         orden_carga_id: this.idOC,
  //         comentario: comentario,
  //       };
  //       formData.append('data', JSON.stringify(data));

  //       // Llamar al servicio para guardar el comentario
  //       this.ordenCargaService.createComentarios(formData).subscribe(
  //         (item) => {
  //           this.getData();
  //           this.router.navigate([this.backUrl]);
  //         },
  //         (error) => {
  //           console.error('Error al crear el comentario', error);
  //         }
  //       );
  //     } else {
  //       // Si el comentario está vacío o no ha cambiado, solo navegar sin guardar
  //       this.router.navigate([this.backUrl]);
  //     }
  //   }
  // }

   back(confirmed: boolean): void {
      if (confirmed) {
        this.submit(confirmed);
      } else {
        this.router.navigate([this.backUrl]);
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
      this.dialog.confirmation(
        '¿Está seguro que desea aceptar la Orden de Carga?',
        () => {
          let comentario = this.form.get('info.comentarios')?.value;
          if (comentario) {
            comentario = comentario.toUpperCase();
          }
          if (comentario !== this.originalComentario) {
            this.createComentarioYAceptar(comentario);
          } else {
            this.aceptarOrdenCarga();
          }
        }
      );
    } else {

    }
  }

  private createComentarioYAceptar(comentario: string): void {
    const formData = new FormData();
    const data = {
      orden_carga_id: this.idOC,
      comentario: comentario,
    };
    formData.append('data', JSON.stringify(data));

    this.ordenCargaService.createComentarios(formData).subscribe(
      () => {
        this.aceptarOrdenCarga();
      },
      (error) => {
        console.error('Error al crear el comentario', error);
      }
    );
  }

  private aceptarOrdenCarga(): void {
    this.ordenCargaService.aceptar(this.idOC as number).subscribe(
      () => {
        this.snackbar.open('Estado cambiado satisfactoriamente');
        this.puedeCrearRemision = true;
      },
      (error) => {
        console.error('Error al aceptar la orden de carga:', error);
      }
    );
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
        '¿Está seguro que desea Cancelar la Orden de Carga?',
        this.ordenCargaService.cancelar(this.idOC),
        () => {
            this.getData();
            const dialogRef = this.openEvaluacionesDialog();

            dialogRef.afterClosed().subscribe(result => {
                this.snackBar.open('Generando PDF...', 'Cerrar', {
                    duration: 3000,
                    verticalPosition: 'top',
                    horizontalPosition: 'center'
                });

                this.downloadConciliarResumenPDF();

                if (!result) {
                    this.form.get('combinacion.id_orden_carga')?.disable();
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
            this.createComentarioAndFinalizar(comentario);
        } else {
            this.finalizarOrdenCarga();
        }
    } else {
        console.error('No se puede finalizar la Orden de Carga sin un ID válido');
    }
  }

  private createComentarioAndFinalizar(comentario: string): void {
      const formData = new FormData();
      const data = {
          orden_carga_id: this.idOC,
          comentario: comentario,
      };
      formData.append('data', JSON.stringify(data));

      this.ordenCargaService.createComentarios(formData).subscribe(
          () => {
              this.finalizarOrdenCarga();
          },
          (error) => {
              console.error('Error al crear el comentario', error);
          }
      );
  }

  private finalizarOrdenCarga(): void {
    this.dialog.changeStatusConfirm(
        '¿Está seguro que desea finalizar la Orden de Carga?',
        this.ordenCargaService.finalizar(this.idOC),
        () => {
            this.getData();
            const dialogRef = this.openEvaluacionesDialog();

            dialogRef.afterClosed().subscribe(result => {
                this.snackBar.open('Generando PDF...', 'Cerrar', {
                    duration: 3000,
                    verticalPosition: 'top',
                    horizontalPosition: 'center'
                });

                this.downloadResumenPDF();

                if (!result) {
                    this.form.get('combinacion.id_orden_carga')?.disable();
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

  openEvaluacionesDialog(): MatDialogRef<EvaluacionesDialogComponent> {
    return this.dialog.open(EvaluacionesDialogComponent, {
      data: {
        orden_carga_id: this.item?.id,
        camion_id: this.item?.camion_id,
        semi_id: this.item?.semi_id,
        propietario_id: this.item?.propietario_id,
        chofer_id: this.item?.chofer_id,
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
        propietario_id: this.item?.propietario_id,
        chofer_id: this.item?.chofer_id,
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

        const comentario = this.form.get('info.comentarios')?.value;
        const comentarioUpper = comentario ? comentario.toUpperCase() : '';

        if (comentarioUpper) {
          this.createComentarioYConciliar(comentarioUpper);
        }
      }
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

  previewPDF(): void {
    if (!this.item){
      return
    }
    this.ordenCargaService.pdf(this.item!.id).subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        const url = URL.createObjectURL(file);
        window.open(url);
        this.pdfSrc = url;
      });
    });
  }

  openRemitirDialog(): void {
    this.dialog.open(OcRemitirDialogComponent, {
      width: '600px',
      data: { oc: this.item },
    });
  }


  onFleteChange(flete: FleteList | undefined): void {
    if (flete) {
      this.flete = flete;
      if (this.item) {
        this.item.flete_id = flete.id;
        this.item.condicion_gestor_cuenta_tarifa = flete.condicion_gestor_carga_tarifa;
        this.item.condicion_propietario_tarifa = flete.condicion_propietario_tarifa;
        this.item.condicion_propietario_tarifa_ml = flete.condicion_propietario_tarifa;
        // Mermas para GC
        this.item.merma_gestor_carga_valor = flete.merma_gestor_carga_valor;
        this.item.merma_gestor_carga_tolerancia = flete.merma_gestor_carga_tolerancia;
        this.item.merma_gestor_carga_es_porcentual_descripcion = flete.merma_gestor_carga_es_porcentual_descripcion;
        // Mermas para Propietario
        this.item.merma_propietario_valor = flete.merma_propietario_valor;
        this.item.merma_propietario_tolerancia = flete.merma_propietario_tolerancia;
        this.item.merma_propietario_es_porcentual_descripcion = flete.merma_propietario_es_porcentual_descripcion;

        const ordenCargaId = this.form.get('combinacion.id_orden_carga')?.value;

        if (this.item.estado === EstadoEnum.ACEPTADO || this.item.estado === EstadoEnum.FINALIZADO) {
          this.ordenCargaService.recalcularCondiciones(flete.id, ordenCargaId).subscribe({
            next: (recalculoResponse) => {
              if (this.item) {
                this.item.condicion_gestor_carga_tarifa_ml = recalculoResponse.condicion_gestor_carga_tarifa_ml;
                this.item.condicion_propietario_tarifa_ml = recalculoResponse.condicion_propietario_tarifa_ml;
                this.item.merma_gestor_carga_valor_ml = recalculoResponse.merma_gestor_carga_valor_ml;
                this.item.merma_propietario_valor = recalculoResponse.merma_propietario_valor_ml;
              }
            },
            error: (error) => {
              console.error('Error en el recalculo:', error);
            }
          });
        }
        if (this.item.estado === EstadoEnum.ACEPTADO || this.item.estado === EstadoEnum.FINALIZADO) {
            this.ordenCargaService.updateSaldoFletes(flete.id, ordenCargaId).subscribe({
              next: (updateSaldos) => {
                if (this.flete) {
                  this.flete.cargado  = updateSaldos.flete_cargado;

                }
              },
              error: (error) => {
                console.error('Error en el recalculo:', error);
              }
            });
          }
        }
      }
    }


  submit(confirmed: boolean): void {
    this.isInfoTouched = false;
    this.form.markAsDirty();
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.isButtonPressed = false;
      this.isEditPedido = false;
      this.isEditPressed = true;
      this.form.get('combinacion.flete_id')?.disable();

      const tipoId = 1;
      const fleteId = this.form.get('combinacion.flete_id')?.value;
      const id_oc = this.form.get('combinacion.id_orden_carga')?.value;

      this.insumoService.getByTipoIdAndFleteId(tipoId, fleteId).subscribe({
        next: (anticipoFlete) => {
          const anticipoFleteId = anticipoFlete.id;

          if (typeof anticipoFleteId === 'number' && !isNaN(anticipoFleteId)) {
            this.ordenCargaSaldoService.getByFleteAnticipoIdAndOrdenCargaId(anticipoFleteId, id_oc).subscribe({
              next: (saldoAnticipo) => {
                this.ordenCargaSaldoService.getSaldoCombustible(this.item!.id, this.item!.flete_id).subscribe({
                  next: (saldoCombustible) => {
                    const data = {
                      ...this.form.value.info,
                      flete_id: this.item?.flete_id,
                      // Condiciones GC, Propietario
                      condicion_gestor_carga_tarifa: this.item?.condicion_gestor_cuenta_tarifa,
                      condicion_propietario_tarifa: this.item?.condicion_propietario_tarifa,
                      // Mermas para GC
                      merma_gestor_carga_valor: this.item?.merma_gestor_carga_valor,
                      merma_gestor_carga_tolerancia: this.item?.merma_gestor_carga_tolerancia,
                      // Mermas para Propietario
                      merma_propietario_valor: this.item?.merma_propietario_valor,
                      merma_propietario_tolerancia: this.item?.merma_propietario_tolerancia,
                      anticipos: this.item?.porcentaje_anticipos,
                      saldoAnticipo: saldoAnticipo,
                      saldoCombustible: saldoCombustible,
                      flete_cargado: this.flete?.cargado,
                    };

                    const formData = new FormData();
                    formData.append('data', JSON.stringify(data));

                    if (this.isEdit) {
                      this.hasChange = false;
                      this.initialFormValue = this.form.value;
                      this.ordenCargaService.edit(this.id, formData).subscribe(() => {
                        this.snackbar.openUpdateAndRedirect(confirmed, this.backUrl);
                        setTimeout(() => {
                          this.getDataWithoutOverwritingFlete();
                        }, 1000);
                      });
                    }
                  },
                  error: err => {
                    console.error('Error al obtener saldo combustible:', err);
                  }
                });
              },
              error: (error) => {
                console.error('Error al obtener el saldo de anticipo:', error);
              }
            });
          } else {
            console.error('El ID de anticipo de flete no es válido:', anticipoFleteId);
          }
        },
        error: (error) => {
          console.error('Error al obtener el anticipo de flete:', error);
        }
      });
    }
  }

  enableFleteId(): void {
    if (this.item?.estado === 'Conciliado') {
      this.snackBar.open(
        'No se puede cambiar el pedido, la orden ya está Conciliada',
        'Cerrar',
        { duration: 3000 }
      );
      return;
    }
    else {
      this.form.get('combinacion.flete_id')?.enable();
      this.isButtonPressed = true;
      this.isEditPedido = true;
      this.isEditPressed = false;
    }
  }

  onEditPressed() {
    this.isEditPressed = false;
  }

  getDataWithoutOverwritingFlete(): void {
    const backUrl = this.route.snapshot.queryParams.backUrl;
    if (backUrl) {
        this.backUrl = backUrl;
    }
    this.id = +this.route.snapshot.params.id;
    this.isEdit = /edit/.test(this.router.url);

    this.ordenCargaService.getById(this.id).subscribe((data) => {
        this.item = data;
        //Condiciones GC, Propietario
        this.isActive = data.estado === EstadoEnum.NUEVO;
        this.item.condicion_gestor_cuenta_tarifa = data.condicion_gestor_cuenta_tarifa;
        this.item.condicion_propietario_tarifa = data.condicion_propietario_tarifa;
        //  Mermas GC
        this.item.merma_gestor_carga_valor = data.merma_gestor_carga_valor;

        this.item.merma_gestor_carga_tolerancia = data.merma_gestor_carga_tolerancia;
        //Mermas Propietario
        this.item.merma_propietario_valor = data.merma_propietario_valor;

        this.item.merma_propietario_tolerancia = data.merma_propietario_tolerancia

        this.item.porcentaje_anticipos = data.porcentaje_anticipos

        this.item.saldos_flete_id = data.saldos_flete_id

        this.originalComentario = data.comentarios ?? null;
        this.form.get('info.comentarios')?.enable();

        setTimeout(() => {
            this.hasChange = false;
            this.initialFormValue = this.form.value;
        }, 500);
    });
  }

  loadSaldoCombustible(ordenCargaId: number, fleteId: number): void {
    this.ordenCargaSaldoService.getSaldoCombustible(ordenCargaId, fleteId).subscribe({
      next: (saldo) => {
        if (!this.item || !this.item.saldos_flete_id) return;

        const concepto = 'COMBUSTIBLE';

        const saldoCombustible = this.item.saldos_flete_id.find(s => s.concepto?.toUpperCase() === concepto);

        if (saldoCombustible) {
          saldoCombustible.total_disponible = saldo;
        }

        this.chRef.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando saldo combustible:', err);
      }
    });
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
        this.item.condicion_gestor_cuenta_tarifa = data.condicion_gestor_cuenta_tarifa;
        this.form.patchValue({
            combinacion: {
                ...this.form.value.combinacion, // Mantenemos los valores actuales
                flete_id: data.flete_id,
                camion_id: data.camion_id,
                camion_placa: data.camion_placa,
                combinacion_id: data.combinacion_id,
                marca_camion: data.camion_marca,
                color_camion: data.camion_color,
                semi_id: data.semi_id,
                semi_placa: data.semi_placa,
                marca_semi: data.semi_marca,
                color_semi: data.semi_color,
                propietario_camion: data.camion_propietario_nombre,
                propietario_camion_doc: data.camion_propietario_documento,
                chofer_camion:  this.item.chofer_nombre,
                chofer_camion_doc: data.combinacion_chofer_doc,
                beneficiario_camion: data.propietario_nombre,
                beneficiario_camion_doc: data.camion_beneficiario_documento,
                numero: data.flete_numero_lote,
                saldo: data.camion_total_anticipos_retirados_en_estado_pendiente_o_en_proceso,
                cliente: data.flete_remitente_nombre,
                tipo_flete: data.flete_tipo,
                producto_descripcion: data.flete_producto_descripcion,
                origen_nombre: data.flete_origen_nombre,
                destino_nombre: data.flete_destino_nombre,
                a_pagar: data.condicion_propietario_tarifa,
                neto: data.neto,
                valor: data.merma_gestor_carga_valor,
                cant_origen: data.cantidad_origen,
                cant_destino: data.cantidad_destino,
                diferencia: data.diferencia_origen_destino,
                puede_recibir_anticipos: data.combinacion_chofer_puede_recibir_anticipos,
                estado: data.estado,
                anticipos: data.anticipos_liberados,
                id_orden_carga: data.id,
                condicion: data.condicion_gestor_cuenta_tarifa,
                tieneDocumentoFisico:false,
                anticipo_propietario: data.camion_propietario_puede_recibir_anticipos,
                is_chofer_condicionado: data.is_chofer_condicionado,
                is_propietario_condicionado: data.is_propietario_condicionado,
            },
            info: {
                cantidad_nominada: data.cantidad_nominada,
                documento_fisico:data.documento_fisico,
            },
            tramo: {
                flete_origen_id: data.flete_origen_id,
                flete_destino_id: data.flete_destino_id,
                origen_id: data.flete_origen_nombre,
                destino_id: data.flete_destino_nombre,
            },
        });

    this.ordenCargaSaldoService.getSaldoCombustible(this.item.id, this.item.flete_id)
        .subscribe({
          next: saldo => {
            // console.log('Saldo combustible generado:', saldo);
            this.ordenCargaService.getById(this.item!.id).subscribe((ocActualizada) => {
              this.item = ocActualizada;
              // console.log('OC actualizada después del saldo combustible:', this.item);
            });
          },
          error: err => {
            console.error('Error creando saldo combustible:', err);
          }
        });

        if (this.isShow) {
          this.form.disable();
        }

        this.originalComentario = data.comentarios ?? null;
        // Todo debe estar deshabilitado
        this.form.get('info.comentarios')?.enable();

        if (data.estado === 'Finalizado'){
          this.form.get('info.documento_fisico')?.enable();
        }

        setTimeout(() => {
            this.hasChange = false;
            this.initialFormValue = this.form.value;
            this.form.get('combinacion.combinacion_id')?.disable();
            this.form.get('combinacion.flete_id')?.disable();
            this.form.get('combinacion.id_orden_carga')?.disable();
            this.form.get('combinacion.id_orden_carga')?.disable();
        }, 1000);

    });
  }

  recalcularProvisiones(): void {
    console.log("recalcularProvisiones");
    if (this.idOC !== null && this.idOC !== undefined) {
      if (this.item?.estado === 'Conciliado') {
        alert('La Orden de Carga ya está conciliada.');
        return;
      }

      if (this.item?.estado !== 'Finalizado') {
        alert('No se puede generar provisiones de orden, debe estar en estado FINALIZADO.');
        return;
      }

      this.ordenCargaService.provisiones(this.idOC).subscribe( res => {
        //this.getData();
        this.snackBar.open('Provisiones Generado con exito', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
      });
      });

    } else {
      console.error('No se puede conciliar la Orden de Carga sin un ID válido');
    }
  }

}
