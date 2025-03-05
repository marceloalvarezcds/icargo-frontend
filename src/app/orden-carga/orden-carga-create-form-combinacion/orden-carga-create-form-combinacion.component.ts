import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as saveAs from 'file-saver';
import { subtract } from 'lodash';
import { CommentDialogComponent } from 'src/app/dialogs/comment-dialog/comment-dialog.component';

import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { PermisoModeloEnum } from 'src/app/enums/permiso-enum';
import { Camion } from 'src/app/interfaces/camion';
import { Chofer } from 'src/app/interfaces/chofer';
import { CombinacionList } from 'src/app/interfaces/combinacion';
import { Flete, FleteList } from 'src/app/interfaces/flete';
import { OrdenCarga, OrdenCargaList } from 'src/app/interfaces/orden-carga';
import { OrdenCargaComentariosHistorial } from 'src/app/interfaces/orden_carga_comentarios_historial';
import { Semi, SemiList } from 'src/app/interfaces/semi';
import { CamionService } from 'src/app/services/camion.service';
import { ChoferService } from 'src/app/services/chofer.service';
import { CombinacionService } from 'src/app/services/combinacion.service';

import { FleteService } from 'src/app/services/flete.service';
import { OrdenCargaService } from 'src/app/services/orden-carga.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SemiService } from 'src/app/services/semi.service';
import { OrdenCargaAnticipoRetirado } from 'src/app/interfaces/orden-carga-anticipo-retirado';
import { INFERRED_TYPE } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-orden-carga-create-form-combinacion',
  templateUrl: './orden-carga-create-form-combinacion.component.html',
  styleUrls: ['./orden-carga-create-form-combinacion.component.scss'],
})
export class OrdenCargaCreateFormCombinacionComponent implements OnInit, OnChanges {
  flete?: FleteList;
  combinacion?: CombinacionList;
  ocList?: OrdenCargaList;
  groupName = 'combinacion';
  groupNameInfo = 'info'
  camionId?: number;
  combinacionId?: number;
  semiAsociado?: number;
  semi?: SemiList;
  showPedidoSection: boolean = false;

  isEditMode: boolean = true;
  pdfSrc: string | undefined;
  manualChange: boolean = false;
  private originalNeto: number | null = null;

  @Input() submodule: string | undefined;
  @Input() activeSection: boolean = true ;
  @Input() list: OrdenCargaComentariosHistorial[] = [];
  @Input() listAnticipos: OrdenCargaAnticipoRetirado[] = [];
  @Input() isNeto: boolean = false ;
  @Input() showField: boolean = false;
  @Input() isConciliar: boolean = false;
  @Input() isEditField: boolean = false;
  @Input() showTractoField: boolean = false;
  @Input() gestorCargaId?: number;
  @Input() oc?: OrdenCarga;
  @Input() form?: FormGroup;
  @Input() showSearchPedido: boolean = false;
  @Input() ocAceptadaEvents?: Observable<OrdenCargaList>;
  @Input() onlyViewCreate: boolean = false;
  @Input() showSearchOCAceptadas: boolean = false;
  @Input() shouldHideFinalizadoComponent: boolean = false;
  @Input() showSearchOCNuevos: boolean = false;
  @Input() showSearchOCfinalizadas: boolean = false;
  @Input() showOCaFinalizar: boolean = false;
  @Input() mostrarInformacionPrincipal: boolean = false;
  @Input() showSearchOCPedidos: boolean = false;
  @Input() isSaveForm: boolean = false;
  @Input() disabled: boolean = false;
  @Input() isEdit = false;
  @Input() modelo?: PermisoModeloEnum;
  @Input() disableForm: boolean = false;
  @Input() showId: boolean = false;
  @Output() fleteChange = new EventEmitter<FleteList>();
  @Output() camionChange = new EventEmitter<Camion>();
  @Output() semiChange = new EventEmitter<Semi>();
  @Output() choferChange = new EventEmitter<Chofer>();
  @Output() combinacionChange = new EventEmitter<CombinacionList>();
  @Output() ordenCargaChange = new EventEmitter<OrdenCargaList | undefined>();
  @Output() resetFormEvent: EventEmitter<void> = new EventEmitter<void>();
  // eventos dialogs
  combinacionEventsSubject: Subject<CombinacionList> = new Subject<CombinacionList>();
  fleteEventsSubject: Subject<FleteList> = new Subject<FleteList>();
  ocEventsSubject: Subject<OrdenCargaList> = new Subject<OrdenCargaList>();

  /*  collapside */
  colapseDivPrincipal = false;
  colapseDivFlota = false;
  colapseDivpedido = false;
  colapseDivCantidad = false;

  ngOnInit() {
    // Detectar cuando el usuario cambia manualmente el valor de cantidad_nominada
    this.form?.get(this.groupNameInfo)?.get('cantidad_nominada')?.valueChanges.subscribe(() => {
      this.manualChange = true; // Se activa la bandera cuando se cambia manualmente
    });

    if (this.isEdit || this.isShow || this.showSearchOCPedidos) {

      this.form?.get(this.groupName)?.get('flete_id')?.valueChanges
        .pipe(
          //debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe((value) => {

          if (value) {
            setTimeout(() => {
              this.fleteService.getFleteListById(value).subscribe( f => {
                this.flete = f;
                this.fleteEventsSubject.next(f);
              });
            }, 800);
          }

        });

      this.form?.get(this.groupName)?.get('combinacion_id')?.valueChanges
        .pipe(
          //debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe((value) => {

          if (value) {
            setTimeout(() => {
              this.combinacionService.getCombinacionById(value).subscribe( f => {
                this.combinacion = f;
                this.combinacionEventsSubject.next(f);
              });
            }, 300);
          }

        });

      this.form?.get(this.groupName)?.get('id_orden_carga')?.valueChanges
        .pipe(
          //debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe((value) => {
          if (value) {
            setTimeout(() => {
              this.ordenCargaService.getOCListById(value).subscribe( f => {
                this.ocList = f;
                this.ocEventsSubject.next(f);
              });
            }, 1100);
          }

        });
      }

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.oc && changes.oc.currentValue) {
      this.onOrdenCargaChange(changes.oc.currentValue);
    }
  }

  get diferenciaOrigenDestino(): number {
    return subtract(
      this.oc?.cantidad_origen ?? 0,
      this.oc?.cantidad_destino ?? 0
    );
  }

  get info(): FormGroup | undefined{
    return this.form?.get('info') as FormGroup ?? null;
  }

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup ?? null;
  }

  get productoId(): number | undefined {
    return this.flete ? this.flete.producto_id : undefined;
  }

  get isActive() {
    return this.info?.controls['anticipo_propietario'].value;
  }

  get estadoChofer(): FormControl {
    return  this.form?.get(this.groupName)?.get('puede_recibir_anticipos') as FormControl
  }

  isFormValid(): boolean {
    return  this.form?.get(this.groupName)?.get('semi_placa')?.value
  }

  get historialComentariosList(): OrdenCargaComentariosHistorial[] {
    return this.oc!?.comentario.slice();
  }

  @Input()
  set orden(value: any) {
    this.orden = value;
    if (this.form) {
      this.form.get('id')?.setValue(this.idOrdenCarga);
    }
  }

  get orden(): any {
    return this.orden;
  }

  get idOrdenCarga(): number {
    return this.orden?.id ?? 0; // Retorna 0 si `oc` es null/undefined
  }

  get tieneComentarios(): boolean {
    return this.historialComentariosList && this.historialComentariosList.length > 0;
  }

  previewPDF(): void {
    this.ordenCargaService.pdf(this.oc!.id).subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        const url = URL.createObjectURL(file);
        window.open(url);
        this.pdfSrc = url;
      });
    });
  }

  updateComentarios(newComentario: string): void {
    this.group.get('comentarios')?.setValue(newComentario);
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


  constructor(
      private service: SemiService,
      private choferService: ChoferService,
      private camionService: CamionService,
      private fleteService: FleteService,
      private cdr: ChangeDetectorRef,
      private ordenCargaService: OrdenCargaService,
      private combinacionService: CombinacionService,
      private reportsService: ReportsService,
      private matDialog: MatDialog,
  ) {}


  onFleteChange(flete: FleteList): void {
    this.flete = flete;
    this.fleteChange.emit(flete);

    this.fleteService.getList().subscribe(
      (fletes: FleteList[]) => {

        const formGroup = this.form?.get(this.groupName);

        if (formGroup?.get('numero_lote')?.value !== flete.numero_lote) {
          formGroup?.get('numero_lote')?.setValue(flete.numero_lote);
        }
        if (formGroup?.get('pedido_id')?.value !== flete.id) {
          formGroup?.get('pedido_id')?.setValue(flete.id);
        }
        if (formGroup?.get('saldo')?.value !== flete.condicion_cantidad) {
          formGroup?.get('saldo')?.setValue(flete.condicion_cantidad);
        }
        if (formGroup?.get('cliente')?.value !== flete.remitente_nombre) {
          formGroup?.get('cliente')?.setValue(flete.remitente_nombre);
        }
        if (formGroup?.get('producto_descripcion')?.value !== flete.producto_descripcion) {
          formGroup?.get('producto_descripcion')?.setValue(flete.producto_descripcion);
        }
        if (formGroup?.get('origen_nombre')?.value !== flete.origen_nombre) {
          formGroup?.get('origen_nombre')?.setValue(flete.origen_nombre);
        }
        if (formGroup?.get('destino_nombre')?.value !== flete.destino_nombre) {
          formGroup?.get('destino_nombre')?.setValue(flete.destino_nombre);
        }
        if (formGroup?.get('tipo_flete')?.value !== flete.tipo_flete) {
          formGroup?.get('tipo_flete')?.setValue(flete.tipo_flete);
        }
        if (formGroup?.get('a_pagar')?.value !== flete.condicion_propietario_tarifa) {
          formGroup?.get('a_pagar')?.setValue(flete.condicion_propietario_tarifa);
        }
        if (formGroup?.get('valor')?.value !== flete.merma_gestor_carga_valor) {
          formGroup?.get('valor')?.setValue(flete.merma_gestor_carga_valor);
        }
        if (flete && flete.condicion_gestor_carga_unidad_id !== undefined) {
          formGroup?.get('unidad_id')?.setValue(flete.condicion_gestor_carga_unidad_id ?? '');
        }
        if (flete && flete.condicion_gestor_carga_moneda_id !== undefined) {
          formGroup?.get('moneda_id')?.setValue(flete.condicion_gestor_carga_moneda_id);
        }

        formGroup?.get('cant_origen')?.setValue(0);
        formGroup?.get('cant_destino')?.setValue(0);
        formGroup?.get('diferencia')?.setValue(0);
      },
    );
  }

  onSemiChange(semi: Semi | undefined): void {
    if (semi) {
      this.semiChange.emit(semi);
    }
  }

  onChoferChange(semi: Chofer | undefined): void {
    if (semi) {
      this.choferChange.emit(semi);
    }
  }

  onCamionChange(combinacion?: CombinacionList) {
    if (combinacion) {
      // Solo almacena el valor original de neto una vez
      if (this.originalNeto === null) {
        this.originalNeto = this.form?.get(this.groupName)?.get('neto')?.value;
      }

      if (!this.form?.get(this.groupName)?.get('semi_placa')?.value) {
        this.form?.get(this.groupName)?.get('semi_placa')?.setValue(combinacion.semi_placa);
      }

      if (!this.form?.get(this.groupName)?.get('marca_semi')?.value) {
        this.form?.get(this.groupName)?.get('marca_semi')?.setValue(combinacion.marca_descripcion_semi ?? null);
      }

      if (!this.form?.get(this.groupName)?.get('color_semi')?.value) {
        this.form?.get(this.groupName)?.get('color_semi')?.setValue(combinacion.color_semi ?? null);
      }

      if (!this.form?.get(this.groupName)?.get('chofer_camion')?.value) {
        this.form?.get(this.groupName)?.get('chofer_camion')?.setValue(combinacion.chofer_nombre);
      }

      if (!this.form?.get(this.groupName)?.get('chofer_camion_doc')?.value) {
        this.form?.get(this.groupName)?.get('chofer_camion_doc')?.setValue(combinacion.chofer_numero_documento);
      }

      if (!this.form?.get(this.groupName)?.get('beneficiario_camion')?.value) {
        this.form?.get(this.groupName)?.get('beneficiario_camion')?.setValue(combinacion.propietario_nombre);
      }

      if (!this.form?.get(this.groupName)?.get('beneficiario_camion_doc')?.value) {
        this.form?.get(this.groupName)?.get('beneficiario_camion_doc')?.setValue(combinacion.propietario_ruc);
      }
      this.form?.get(this.groupName)?.get('camion_id')?.setValue(combinacion.camion_id);
      this.form?.get(this.groupName)?.get('camion_placa')?.setValue(combinacion.camion_placa);
      this.form?.get(this.groupName)?.get('marca_camion')?.setValue(combinacion.marca_descripcion);
      this.form?.get(this.groupName)?.get('color_camion')?.setValue(combinacion.color_camion ?? null);
      this.form?.get(this.groupName)?.get('semi_id')?.setValue(combinacion.semi_id);
      this.form?.get(this.groupName)?.get('chofer_id')?.setValue(combinacion.chofer_id);
      this.form?.get(this.groupName)?.get('propietario_id')?.setValue(combinacion.propietario_id);
      this.form?.get(this.groupName)?.get('propietario_camion')?.setValue(combinacion.camion_propietario_nombre);
      this.form?.get(this.groupName)?.get('propietario_camion_doc')?.setValue(combinacion.camion_propietario_documento);
      // Comparar y actualizar solo si el nuevo neto es diferente del original
      if (combinacion.neto !== this.originalNeto) {
        this.form?.get(this.groupName)?.get('neto')?.setValue(combinacion.neto);
      } else {
        // Si no hay cambio, restablece al valor original
        this.form?.get(this.groupName)?.get('neto')?.setValue(this.originalNeto);
      }

      this.form?.get(this.groupName)?.get('anticipo_propietario')?.setValue(combinacion.anticipo_propietario);
      this.form?.get(this.groupName)?.get('puede_recibir_anticipos')?.setValue(combinacion.puede_recibir_anticipos);
      this.form?.get(this.groupNameInfo)?.get('cantidad_nominada')?.setValue(combinacion.neto);

      this.combinacionId = combinacion.id;
      this.combinacionChange.emit(combinacion);

      this.service.getById(combinacion.semi_id).subscribe(semi => {
        this.onSemiChange(semi);
      });

      this.choferService.getById(combinacion.chofer_id).subscribe(chofer => {
        this.onChoferChange(chofer);
      });
    }
  }


  onOrdenCargaChange(oc?: OrdenCargaList) {
    if (oc) {
      this.ordenCargaChange.emit(oc);
      this.form?.get(this.groupName)?.get('id_orden_carga')?.setValue(oc.id);
      this.form?.get(this.groupName)?.get('camion_placa')?.setValue(oc.camion_placa);
      this.form?.get(this.groupName)?.get('flete_id')?.setValue(oc.flete_id);
      this.form?.get(this.groupName)?.get('numero_lote')?.setValue(oc.flete_numero_lote);
      this.form?.get(this.groupName)?.get('saldo')?.setValue(oc.flete_saldo);
      this.form?.get(this.groupName)?.get('cliente')?.setValue(oc.flete_remitente_nombre);
      this.form?.get(this.groupName)?.get('producto_descripcion')?.setValue(oc.flete_producto_descripcion);
      this.form?.get(this.groupName)?.get('origen_nombre')?.setValue(oc?.flete_origen_nombre);
      this.form?.get(this.groupName)?.get('destino_nombre')?.setValue(oc?.flete_destino_nombre);
      this.form?.get(this.groupName)?.get('tipo_flete')?.setValue(oc.flete_tipo);
      this.form?.get(this.groupName)?.get('anticipos')?.setValue(oc.anticipos_liberados);
      if (this.manualChange) {
        this.form?.get(this.groupNameInfo)?.get('cantidad_nominada')?.setValue(oc.cantidad_nominada);
      }
      this.form?.get(this.groupName)?.get('cant_origen')?.setValue(oc.cantidad_origen);
      this.form?.get(this.groupName)?.get('cant_destino')?.setValue(oc.cantidad_destino);
      this.form?.get(this.groupName)?.get('diferencia')?.setValue(oc.diferencia_origen_destino);
    }
  }

  downloadPDF(): void {
    this.ordenCargaService.pdf(this.oc!.id).subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }



  @Input() title = 'Chapa Tracto';
  @Input() control!: FormControl;
  @Input() isShow = false;
  @Input() trueTitle = 'Si';
  @Input() falseTitle = 'No';
  @Input() readonly = false;
  @Output() valueChange = new EventEmitter<boolean>();

  get controlValue(): boolean {
    return !!this.control.value;
  }
}
