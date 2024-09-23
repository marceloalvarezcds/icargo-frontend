import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { OcConfirmationDialogComponent } from 'src/app/dialogs/oc-confirmation-dialog/oc-confirmation-dialog.component';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as r,
} from 'src/app/enums/permiso-enum';
import { getOCData } from 'src/app/form-data/oc-confirmation-data';
import { Camion } from 'src/app/interfaces/camion';
import { Combinacion } from 'src/app/interfaces/combinacion';
import { FleteList } from 'src/app/interfaces/flete';
import { OCConfirmationDialogData } from 'src/app/interfaces/oc-confirmation-dialog-data';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { OrdenCargaAnticipoRetirado } from 'src/app/interfaces/orden-carga-anticipo-retirado';
import { OrdenCargaComplemento } from 'src/app/interfaces/orden-carga-complemento';
import { OrdenCargaDescuento } from 'src/app/interfaces/orden-carga-descuento';
import { OrdenCargaRemisionDestino } from 'src/app/interfaces/orden-carga-remision-destino';
import { OrdenCargaRemisionOrigen } from 'src/app/interfaces/orden-carga-remision-origen';
import { OrdenCargaRemisionResultado } from 'src/app/interfaces/orden-carga-remision-resultado';
import { Semi } from 'src/app/interfaces/semi';
import { DialogService } from 'src/app/services/dialog.service';
import { OrdenCargaService } from 'src/app/services/orden-carga.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { PdfPreviewDialogComponent } from '../pdf-preview-dialog/pdf-preview-dialog.component';

@Component({
  selector: 'app-orden-carga-recepcion-form',
  templateUrl: './orden-carga-recepcion-form.component.html',
  styleUrls: ['./orden-carga-recepcion-form.component.scss']
})
export class OrdenCargaRecepcionFormComponent  implements OnInit, OnDestroy {
  flete?: FleteList;
  isFormSubmitting = true;
  previousid: number | null = null;
  isLoadingData: boolean = false;
  private valueChangesSubscription: any;
  previousId: number | null = null;
  backUrl = `/orden-carga/${m.ORDEN_CARGA}/${a.LISTAR}`;
  modelo = m.ORDEN_CARGA;
  id?: number;
  camion?: Camion;
  semi?: Semi;
  combinacionList?: Combinacion
  isFormSaved: boolean = false;
  puedeCrearRemision: boolean = false
  ordenCargaId: number | null = null;
  item?: OrdenCarga;
  isActive = false;
  isShow: boolean = true;
  fleteId?: number;
  dataFromParent: string = 'Nuevo';
  isEdit = false;
  isDataLoaded: boolean = true;
  originalComentario: string | null = null;
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
      id_orden_carga: [null, Validators.required],
    }),
    info: this.fb.group({
      cantidad_nominada: null,
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

  get remisionOrigenList(): OrdenCargaRemisionOrigen[] {
    return this.item!?.remisiones_origen.slice();
  }

  get remisionDestinoList(): OrdenCargaRemisionDestino[] {
    return this.item!?.remisiones_destino.slice();
  }

  get remisionResultadoList(): OrdenCargaRemisionResultado[] {
    return this.item!?.remisiones_resultado.slice();
  }

  get complementoList(): OrdenCargaComplemento[] {
    return this.item!?.complementos.slice();
  }

  get descuentoList(): OrdenCargaDescuento[] {
    return this.item!?.descuentos.slice();
  }
  

  get anticipoList(): OrdenCargaAnticipoRetirado[]{
    return this.item!?.anticipos.slice();
  }

  get porcentajeAnticipos(): FormArray {
    return this.form.get('porcentaje_anticipos') as FormArray;
  }

  get gestorCargaId(): number | undefined {
    return this.item?.gestor_carga_id;
  }

  get isAceptado(): boolean {
    return this.item?.estado === EstadoEnum.ACEPTADO;
  }

  get isNuevo(): boolean {
    return this.item?.estado === EstadoEnum.NUEVO;
  }

  get isFinalizado(): boolean {
    return this.estado === EstadoEnum.FINALIZADO;
  }

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

  ngOnInit(): void {
    this.setInitialToggleState();
    this.valueChangesSubscription = this.form.get('combinacion.id_orden_carga')?.valueChanges
    .pipe(
      debounceTime(300), 
      distinctUntilChanged()
    )
    .subscribe(id => {
      this.handleIdChange(id);
    });
  }

  handleIdChange(id: number | null): void {
    if (id && id !== this.previousId) {
      this.previousId = id;
      if (!this.isLoadingData) { // Solo llamar a getData si no se está cargando
        this.getData();
      }
    }
  }

  ngOnDestroy(): void {
    // Cancelar la suscripción para evitar posibles fugas de memoria
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: DialogService,
    private snackbar: SnackbarService,
    private ordenCargaService: OrdenCargaService,
    private userService: UserService,
    private route: ActivatedRoute,
    private reportsService: ReportsService,
    private snackBar: MatSnackBar,
    
  ) {}

  setInitialToggleState(): void {
    if (this.item && this.item.anticipos_liberados) {
      this.isActive = this.item.anticipos_liberados; 
    }
  }

  back(confirmed: boolean): void {
    if (confirmed) {
      // Guardar toda la información si se confirma la acción
      this.save(confirmed);
    } else {
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

  aceptar(): void {
    if (this.idOC !== null && this.idOC !== undefined) {
      this.dialog.confirmation(
        '¿Está seguro que desea aceptar la Orden de Carga?',
        () => {
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
      );
    } else {
      console.error('No se puede aceptar la orden de carga sin un ID válido');
  
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
              this.snackbar.open('Estado cambiado satisfactoriamente');
              this.getData();
              this.form.get('info.comentarios')?.disable();
            }
          );
        });
      } else {
        this.dialog.changeStatusConfirm(
          '¿Está seguro que desea cancelar la Orden de Carga?',
          this.ordenCargaService.cancelar(this.idOC),
          () => {
            this.snackbar.open('Estado cambiado satisfactoriamente');
            this.getData();
            this.form.get('info.comentarios')?.disable();
          }
        );
      }
    } else {
      console.error('No se puede cancelar la Orden de Carga sin un ID válido');
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
          // Luego, proceder con la finalización
          this.dialog.changeStatusConfirm(
            '¿Está seguro que desea finalizar la Orden de Carga?',             
            this.ordenCargaService.finalizar(this.idOC),
            () => {
              this.getData();
              this.form.get('info.comentarios')?.disable();
              this.snackBar.open('Generando PDF...', 'Cerrar', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'center'
              });
              this.downloadResumenPDF();
            }
          );
        });
      } else {
        // Si no hay comentario, directamente proceder con la finalización
        this.dialog.changeStatusConfirm(
          '¿Está seguro que desea finalizar la Orden de Carga?',
          this.ordenCargaService.finalizar(this.idOC),
          () => {
            this.getData();
            this.form.get('info.comentarios')?.disable();
            this.snackBar.open('Generando PDF...', 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
            this.downloadResumenPDF();
          }
        );
      }
    } else {
      console.error('No se puede finalizar anticipos sin un ID válido');
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
  

  get isToggleAnticiposLiberados(): boolean {
    return this.item ? this.item.anticipos_liberados : false;
  }

  private dialogOpened = false;
  
  save(showDialog: boolean = true): void {
    this.form.markAsDirty();
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const data: OCConfirmationDialogData = {
        oc: getOCData(this.form, this.flete, this.camion, this.semi, this.form.get('combinacion')?.get('neto')?.value),
      };

      if (showDialog) {
        if (!this.dialogOpened) {
          this.dialogOpened = true;
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
            .subscribe((confirmed) => {
              this.submit(confirmed); 
              this.dialogOpened = false; 
            });
        }
      } else {
        this.submit(true); 
      }
    }
  }

  getData(): void {
    const ocValue = this.idOC; 
    if (ocValue) { 
      this.isLoadingData = true; 
      this.valueChangesSubscription.unsubscribe();

      this.ordenCargaService.getById(ocValue).subscribe((data) => {
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
            anticipos: data.anticipos_liberados
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
        this.form.get('info.cantidad_nominada')?.disable();
        this.isLoadingData = false; 
        this.originalComentario = data.comentarios ?? null;
        this.ngOnInit();
        this.isFormSaved = true; 
        this.isFormSubmitting = false
        this.isShow = false
      });
    } else {
      console.warn('No se ha encontrado un ID de Orden de Carga válido');
      this.isLoadingData = false; 
    }
  }
  

  submit(confirmed: boolean): void {
    this.isFormSaved = true; 
    this.isFormSubmitting = false
    this.isShow = false
    this.dataFromParent = this.form.get('combinacion.estado')?.value; 
    this.getData();
  }

}
