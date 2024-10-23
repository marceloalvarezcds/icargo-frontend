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
import { MatDialogRef } from '@angular/material/dialog';
import { EvaluacionesCancelarComponent } from 'src/app/dialogs/evaluaciones-cancelar/evaluaciones-cancelar.component';


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
  flete?: FleteList;
  isEditPressed: boolean = true;
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
      condicion: null,
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


  get isToggleAnticiposLiberados(): boolean {
    return this.item ? this.item.anticipos_liberados : false;
  }

  get toggleIcon(): string {
    return this.anticipoList ? 'toggle_on' : 'toggle_off';
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


  back(confirmed: boolean): void {
    if (confirmed) {
      this.submit(confirmed);
    } else {
      let comentario = this.form.get('info.comentarios')?.value;
      if (comentario) {
        comentario = comentario.toUpperCase();
      }
  
      // Si el comentario ha cambiado, proceder a guardarlo
      if (comentario !== this.originalComentario) {
        const confirmation = window.confirm('¿Estás seguro de aplicar los cambios antes de salir?');
  
        if (confirmation) {
          const formData = new FormData();
          
          // Crear un objeto simple con solo los campos necesarios
          const data = {
            orden_carga_id: this.idOC,
            comentario: comentario,
          };
  
          // Añadir el objeto a FormData
          formData.append('data', JSON.stringify(data));
  
          this.ordenCargaService.createComentarios(formData).subscribe(
            (item) => {
              // Actualiza los datos después de guardar el comentario
              this.getData();
  
              // Navega después de actualizar los datos
              this.router.navigate([this.backUrl]);
            },
            (error) => {
              console.error('Error al crear el comentario', error);
             
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
      console.error('No se puede aceptar la orden de carga sin un ID válido');
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
            this.cancelOrdenCarga(); // Llama a cancelar después de crear el comentario
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
            const dialogRef = this.openEvaluacionesCancelarDialog();

            dialogRef.afterClosed().subscribe(result => {
                if (result) { // Si se acepta el diálogo
                    this.snackBar.open('Generando PDF...', 'Cerrar', {
                        duration: 3000,
                        verticalPosition: 'top',
                        horizontalPosition: 'center'
                    });
                    this.downloadResumenPDF();
                } else {
                    console.log('Diálogo de evaluación cancelado');
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
                  if (result) { // Si se acepta el diálogo
                      // Genera el PDF después de que el diálogo se haya cerrado
                      this.snackBar.open('Generando PDF...', 'Cerrar', {
                          duration: 3000,
                          verticalPosition: 'top',
                          horizontalPosition: 'center'
                      });
                      this.downloadResumenPDF();
                  } else {
                      console.log('Diálogo de evaluación cancelado');
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
                    console.log('Diálogo de evaluación cancelado');
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

    
  onFleteChange(flete: FleteList | undefined): void {
    if (flete) {
      this.flete = flete;
      if (this.item) {
        this.item.flete_id = flete.id
        this.item.condicion_gestor_cuenta_tarifa = flete.condicion_gestor_carga_tarifa;
        this.item.condicion_propietario_tarifa = flete.condicion_propietario_tarifa;
        //Mermas para GC
        this.item.merma_gestor_carga_valor = flete.merma_gestor_carga_valor;
        this.item.merma_gestor_carga_tolerancia = flete.merma_gestor_carga_tolerancia;
        this.item.merma_gestor_carga_es_porcentual_descripcion = flete.merma_gestor_carga_es_porcentual_descripcion;
        //Mermas para Propietario
        this.item.merma_propietario_valor = flete.merma_propietario_valor;
        this.item.merma_propietario_tolerancia = flete.merma_propietario_tolerancia;
        this.item.merma_propietario_es_porcentual_descripcion = flete.merma_propietario_es_porcentual_descripcion;
      }
      this.chRef.detectChanges();
    }
    console.log('flete ocChange', this.item?.flete_id)
  }

  enableFleteId(): void {
    this.form.get('combinacion.flete_id')?.enable(); 
    this.isButtonPressed = true;
    this.isEditPedido = true;
    this.isEditPressed = false;
  }
  

  submit(confirmed: boolean): void {
    this.isInfoTouched = false;
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    
    if (this.form.valid) {
        const formData = new FormData();
        this.isButtonPressed = false;
        this.isEditPedido = false;
        this.isEditPressed = true;
        this.form.get('combinacion.flete_id')?.disable(); 
        const data = JSON.parse(
            JSON.stringify({
                  
                ...this.form.value.info,  
                flete_id: this.item?.flete_id,
                //Condiciones GC, Propietario      
                condicion_gestor_carga_tarifa: this.item?.condicion_gestor_cuenta_tarifa, 
                condicion_propietario_tarifa: this.item?.condicion_propietario_tarifa,
                //Mermas para GC
                merma_gestor_carga_valor: this.item?.merma_gestor_carga_valor,
             
                merma_gestor_carga_tolerancia: this.item?.merma_gestor_carga_tolerancia,
                //Mermas para Propietario
                merma_propietario_valor: this.item?.merma_propietario_valor,
              
                merma_propietario_tolerancia: this.item?.merma_propietario_tolerancia
            })
        );

        console.log('Datos enviados:', data); // Verifica los datos enviados
  
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
    }
  }
  
  

  // Este método se ejecuta cuando se presiona el botón en el componente hijo
  onEditPressed() {
    this.isEditPressed = false; // Habilitamos el botón "Guardar"
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

        this.originalComentario = data.comentarios ?? null;
        this.form.get('info.comentarios')?.enable();

        setTimeout(() => {
            this.hasChange = false;
            this.initialFormValue = this.form.value; 
        }, 500);
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
               
                neto: data.neto,
                valor: data.flete_monto_efectivo,
                cant_origen: data.cantidad_origen,
                cant_destino: data.cantidad_destino,
                diferencia: data.diferencia_origen_destino,
                anticipo_chofer: data.camion_chofer_puede_recibir_anticipos,
                estado: data.estado,
                anticipos: data.anticipos_liberados,
                id_orden_carga: data.id,
                condicion: data.condicion_gestor_cuenta_tarifa
            },
            info: {
                cantidad_nominada: data.cantidad_nominada,
            },
            tramo: {
                flete_origen_id: data.flete_origen_id,
                flete_destino_id: data.flete_destino_id,
                origen_id: data.flete_origen_nombre,
                destino_id: data.flete_destino_nombre,
            },
        });
        this.form.disable(); 
        this.originalComentario = data.comentarios ?? null;
        this.form.get('info.comentarios')?.enable();
        setTimeout(() => {
            this.hasChange = false;
            this.initialFormValue = this.form.value; 
        }, 500);
    });
  }
}
