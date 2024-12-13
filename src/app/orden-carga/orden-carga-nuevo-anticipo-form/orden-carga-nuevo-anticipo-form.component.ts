import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash';
import { distinctUntilChanged, filter } from 'rxjs/operators';
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
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { OrdenCargaAnticipoRetirado } from 'src/app/interfaces/orden-carga-anticipo-retirado';
import { Semi, SemiList } from 'src/app/interfaces/semi';
import { DialogService } from 'src/app/services/dialog.service';
import { OrdenCargaService } from 'src/app/services/orden-carga.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { debounceTime } from 'rxjs/operators';
import { OrdenCargaComplemento } from 'src/app/interfaces/orden-carga-complemento';
import { OrdenCargaDescuento } from 'src/app/interfaces/orden-carga-descuento';
import { OrdenCargaComentariosHistorial } from 'src/app/interfaces/orden_carga_comentarios_historial';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvaluacionesCancelarComponent } from 'src/app/dialogs/evaluaciones-cancelar/evaluaciones-cancelar.component';
import { MatDialogRef } from '@angular/material/dialog';
import { PdfPreviewDialogComponent } from '../pdf-preview-dialog/pdf-preview-dialog.component';
import { ReportsService } from 'src/app/services/reports.service';
@Component({
  selector: 'app-orden-carga-nuevo-anticipo-form',
  templateUrl: './orden-carga-nuevo-anticipo-form.component.html',
  styleUrls: ['./orden-carga-nuevo-anticipo-form.component.scss']
})
export class OrdenCargaNuevoAnticipoFormComponent implements OnInit, OnDestroy {

  flete?: FleteList;
  isFormSubmitting = true;
  backUrl = `/orden-carga/${m.ORDEN_CARGA}/${a.LISTAR}`;
  modelo = m.ORDEN_CARGA;
  id?: number;
  camion?: Camion;
  semi?: Semi;
  combinacionList?: Combinacion
  isFormSaved: boolean = false;
  ordenCargaId: number | null = null;
  item?: OrdenCarga;
  isActive = false;
  isShow: boolean = true;
  fleteId?: number;
  dataFromParent: string = 'Nuevo';
  isEdit = false;
  isDataLoaded: boolean = true;
  submodule: string = 'ANTICIPO (directo)';
  originalComentario: string | null = null;
  private dialogOpened = false;
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

  get anticipoList(): OrdenCargaAnticipoRetirado[]{
    return this.item!?.anticipos.slice();
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
  
  get complementoList(): OrdenCargaComplemento[] {
    return this.item!?.complementos.slice();
  }

  get descuentoList(): OrdenCargaDescuento[] {
    return this.item!?.descuentos.slice();
  }
  
  get isAnticiposLiberados(): boolean {
    return this.item!?.anticipos_liberados;
  }

  get comentariosList(): OrdenCargaComentariosHistorial[]{
    return this.item!?.comentario.slice();
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

  previousid: number | null = null;
  isLoadingData: boolean = false;
  private valueChangesSubscription: any;

  ngOnInit(): void {
    this.setInitialToggleState();

    // Suscribirse a cambios en el ID de Orden de Carga
    this.valueChangesSubscription = this.form.get('combinacion.id_orden_carga')?.valueChanges
    .pipe(
      debounceTime(300), // Evitar llamadas frecuentes
      distinctUntilChanged() // Solo ejecutar si el valor cambia
    )
    .subscribe(id => {
      this.handleIdChange(id);
    });
  }
  
  previousId: number | null = null;
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
    private snackBar: MatSnackBar,
    private reportsService: ReportsService,
    
  ) {}

  setInitialToggleState(): void {
    if (this.item && this.item.anticipos_liberados) {
      this.isActive = this.item.anticipos_liberados; 
    }
  }

  back(confirmed: boolean): void {
    if (confirmed) {
      this.submit(confirmed);
    } else {
      let comentario = this.form.get('info.comentarios')?.value;
      
      // Convertir el comentario a mayúsculas si no está vacío
      if (comentario) {
        comentario = comentario.toUpperCase();
      }

      if (comentario !== this.originalComentario && comentario.trim() !== '') {
        const formData = new FormData();
        const data = {
          orden_carga_id: this.idOC,
          comentario: comentario,
        };
        formData.append('data', JSON.stringify(data));
  
        // Llamar al servicio para guardar el comentario
        this.ordenCargaService.createComentarios(formData).subscribe(
          (item) => {
            this.getData();
            this.router.navigate([this.backUrl]);
          },
          (error) => {
            console.error('Error al crear el comentario', error);
          }
        );
      } else {
        // Si el comentario está vacío o no ha cambiado, solo navegar sin guardar
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
                }
            });
        },
    );
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
 
  save(showDialog: boolean = true): void {
    this.form.markAsDirty();
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const data: OCConfirmationDialogData = {
        oc: getOCData(this.form, this.flete, this.form.get('combinacion')?.get('neto')?.value),
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
      this.info.get('comentarios')?.setValue('');
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
            valor: data.merma_gestor_carga_valor,
            cant_origen: data.cantidad_origen,
            cant_destino: data.cantidad_destino,
            diferencia: data.diferencia_origen_destino,
            anticipo_chofer: data.camion_chofer_puede_recibir_anticipos,
            estado: data.estado,
            anticipos: data.anticipos_liberados
          },
          info: {
            cantidad_nominada: data.cantidad_nominada,
            comentarios: '',
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
