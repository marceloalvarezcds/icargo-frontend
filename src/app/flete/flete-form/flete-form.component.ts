import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isEqual } from 'lodash';
import { filter } from 'rxjs/operators';
import { FleteConfirmationDialogComponent } from 'src/app/dialogs/flete-confirmation-dialog/flete-confirmation-dialog.component';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoAccionEnum,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as r,
} from 'src/app/enums/permiso-enum';
import { getFleteData } from 'src/app/form-data/flete-confirmation-data';
import { Flete } from 'src/app/interfaces/flete';
import { FleteAnticipo } from 'src/app/interfaces/flete-anticipo';
import { FleteComplemento } from 'src/app/interfaces/flete-complemento';
import { FleteConfirmationDialogData } from 'src/app/interfaces/flete-confirmation-dialog-data';
import { FleteDescuento } from 'src/app/interfaces/flete-descuento';
import { ActivatedRouteService } from 'src/app/services/activated-route.service';
import { DialogService } from 'src/app/services/dialog.service';
import { FleteService } from 'src/app/services/flete.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { ProportionValidator } from 'src/app/validators/proportion-validator';

@Component({
  selector: 'app-flete-form',
  templateUrl: './flete-form.component.html',
  styleUrls: ['./flete-form.component.scss'],
})
export class FleteFormComponent implements OnInit, OnDestroy {
  a = PermisoAccionEnum;
  id?: number;
  propietarioId?: number;
  estado = EstadoEnum.ACTIVO;
  isCancel = false;
  isEdit = false;
  isShow = false;
  isPanelOpen = false;
  isInfoTouched = true;
  isTramoTouched = false;
  isCondicionTouched = false;
  isMermaTouched = false;
  isAnticipoTouched = false;
  isComplementoTouched = false;
  isDescuentoTouched = false;
  isEmisionOrdenTouched = false;
  item?: Flete;
  backUrl = `/flete/${m.FLETE}/${a.LISTAR}`;
  modelo = m.FLETE;
  gestorCargaId?: number;
  created_by = '';
  created_at = '';
  modified_by = '';
  modified_at = '';

  anticipoList: FleteAnticipo[] = [];
  complementoList: FleteComplemento[] = [];
  descuentoList: FleteDescuento[] = [];

  form = this.fb.group({
    info: this.fb.group({
      remitente_id: [null, Validators.required],
      remitente_nombre: null,
      producto_id: [null, Validators.required],
      producto_descripcion: null,
      tipo_carga_id: [null, Validators.required],
      numero_lote: null,
      publicado: true,
      es_subasta: false,
    }),
    tramo: this.fb.group({
      origen_id: [null, Validators.required],
      origen_nombre: null,
      origen_indicacion: null,
      destino_id: [null, Validators.required],
      destino_nombre: [null, Validators.required],
      destino_indicacion: null,
      distancia: null,
    }),
    condicion: this.fb.group({
      condicion_cantidad: [null, Validators.required],
      // inicio - Condiciones para el Gestor de Carga
      condicion_gestor_carga_moneda_id: [null, Validators.required],
      condicion_gestor_carga_moneda_simbolo: null,
      condicion_gestor_carga_tarifa: [null, Validators.required],
      condicion_gestor_carga_unidad_id: [null, Validators.required],
      condicion_gestor_carga_unidad_abreviatura: null,
      // fin - Condiciones para el Gestor de Carga
      // inicio - Condiciones para el Propietario
      condicion_propietario_moneda_id: [null, Validators.required],
      condicion_propietario_moneda_simbolo: null,
      condicion_propietario_tarifa: [null, Validators.required],
      condicion_propietario_unidad_id: [null, Validators.required],
      condicion_propietario_unidad_abreviatura: null,
      // fin - Condiciones para el Propietario
    }),
    merma: this.fb.group({
      // inicio - Mermas para el Gestor de Carga
      merma_gestor_carga_valor: [null, Validators.required],
      merma_gestor_carga_moneda_id: [null, Validators.required],
      merma_gestor_carga_moneda_simbolo: null,
      merma_gestor_carga_unidad_id: [null, Validators.required],
      merma_gestor_carga_unidad_abreviatura: null,
      merma_gestor_carga_es_porcentual: false,
      merma_gestor_carga_tolerancia: [null, Validators.required],
      // fin - Mermas para el Gestor de Carga
      // inicio - Mermas para el Propietario
      merma_propietario_valor: [null, Validators.required],
      merma_propietario_moneda_id: [null, Validators.required],
      merma_propietario_moneda_simbolo: null,
      merma_propietario_unidad_id: [null, Validators.required],
      merma_propietario_unidad_abreviatura: null,
      merma_propietario_es_porcentual: false,
      merma_propietario_tolerancia: [null, Validators.required],
      // fin - Mermas para el Propietario
    }),
    // vigencia_anticipos: [null, Validators.required],
    anticipos: this.fb.array([], {
      validators: ProportionValidator.max(100, 'porcentaje'),
    }),
    complementos: this.fb.array([]),
    descuentos: this.fb.array([]),
    emision_orden: this.fb.group({
      emision_orden_texto_legal: null,
      emision_orden_detalle: null,
      destinatarios: null,
    }),
  });

  initialFormValue = this.form.value;
  hasChange = false;
  hasChangeSubscription = this.form.valueChanges.subscribe((value) => {
    setTimeout(() => {
      this.hasChange = !isEqual(this.initialFormValue, value);
    });
  });

  get puedeModificar(): boolean {
    if (this.isShow || !this.isEdit) {
      return false;
    }
    return this.userService.checkPermisoAndGestorCargaId(
      a.EDITAR,
      this.modelo,
      this.gestorCargaId
    );
  }

  get info(): FormGroup {
    return this.form.get('info') as FormGroup;
  }

  get tramo(): FormGroup {
    return this.form.get('tramo') as FormGroup;
  }

  get condicion(): FormGroup {
    return this.form.get('condicion') as FormGroup;
  }

  get merma(): FormGroup {
    return this.form.get('merma') as FormGroup;
  }

  get anticipos(): FormArray {
    return this.form.get('anticipos') as FormArray;
  }

  get complementos(): FormArray {
    return this.form.get('complementos') as FormArray;
  }

  get descuentos(): FormArray {
    return this.form.get('descuentos') as FormArray;
  }

  get emisionOrden(): FormGroup {
    return this.form.get('emision_orden') as FormGroup;
  }

  constructor(
    private fb: FormBuilder,
    private fleteService: FleteService,
    private userService: UserService,
    private snackbar: SnackbarService,
    private dialog: DialogService,
    private route: ActivatedRouteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    this.hasChangeSubscription.unsubscribe();
  }

  back(confirmed: boolean): void {
    if (confirmed) {
      this.save(confirmed);
    } else {
      this.router.navigate([this.backUrl]);
    }
  }

  redirectToEdit(): void {
    this.router.navigate([`/flete/${m.FLETE}/${a.EDITAR}`, this.id]);
  }

  cancelar(): void {
    this.dialog.changeStatusConfirm(
      '¿Está seguro que desea cancelar el Flete?',
      this.fleteService.cancel(this.id!),
      () => {
        this.getData();
      }
    );
  }

  save(confirmed: boolean): void {
    this.isInfoTouched = false;
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const data: FleteConfirmationDialogData = {
        flete: getFleteData(this.form),
      };
      this.dialog
        .open(FleteConfirmationDialogComponent, {
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
    } else {
      setTimeout(() => {
        this.isInfoTouched = this.info.invalid;
        this.isTramoTouched = this.tramo.invalid;
        this.isCondicionTouched = this.condicion.invalid;
        this.isMermaTouched = this.merma.invalid;
        this.isAnticipoTouched = this.anticipos.invalid;
        this.isComplementoTouched = this.complementos.invalid;
        this.isDescuentoTouched = this.descuentos.invalid;
        this.isEmisionOrdenTouched = this.emisionOrden.invalid;
      });
    }
  }

  submit(confirmed: boolean): void {
    const formData = new FormData();
    const data = JSON.parse(
      JSON.stringify({
        ...this.info.value,
        ...this.tramo.value,
        ...this.condicion.value,
        ...this.merma.value,
        ...this.emisionOrden.value,
        // vigencia_anticipos: this.form.value.vigencia_anticipos,
        anticipos: this.anticipos.value,
        complementos: this.complementos.value,
        descuentos: this.descuentos.value,
      })
    );
    formData.append('data', JSON.stringify(data));
    this.hasChange = false;
    this.initialFormValue = this.form.value;
    if (this.isEdit && this.id) {
      this.fleteService.edit(this.id, formData).subscribe(() => {
        this.snackbar.openUpdateAndRedirect(confirmed, this.backUrl);
        this.getData();
      });
    } else {
      this.fleteService.create(formData).subscribe((flete) => {
        this.snackbar.openSaveAndRedirect(
          confirmed,
          this.backUrl,
          r.FLETE,
          m.FLETE,
          flete.id
        );
      });
    }
  }

  getData(): void {
    const backUrl = this.route.snapshot.queryParams.backUrl;
    if (backUrl) {
      this.backUrl = backUrl;
    }
    this.propietarioId = +this.route.snapshot.queryParams.propietarioId;
    this.id = +this.route.snapshot.params.id;
    if (this.id) {
      this.isEdit = /edit/.test(this.route.url);
      this.isShow = /ver/.test(this.route.url);
      if (this.isShow) {
        this.form.disable();
      }
      this.fleteService.getById(this.id).subscribe((data) => {
        this.item = data;
        this.estado = data.estado;
        this.isCancel = data.estado === EstadoEnum.CANCELADO;
        this.gestorCargaId = data.gestor_carga_id;
        this.created_by = data.created_by;
        this.created_at = data.created_at;
        this.modified_by = data.modified_by;
        this.modified_at = data.modified_at;
        if (!this.puedeModificar) {
          this.form.disable();
        }
        this.form.patchValue({
          info: {
            remitente_id: data.remitente_id,
            producto_id: data.producto_id,
            tipo_carga_id: data.tipo_carga_id,
            numero_lote: data.numero_lote,
            publicado: data.publicado,
            es_subasta: data.es_subasta,
          },
          tramo: {
            origen_id: data.origen_id,
            origen_indicacion: data.origen_indicacion,
            destino_id: data.destino_id,
            destino_indicacion: data.destino_indicacion,
            distancia: data.distancia,
          },
          condicion: {
            condicion_cantidad: data.condicion_cantidad,
            // inicio - Condiciones para el Gestor de Carga
            condicion_gestor_carga_moneda_id:
              data.condicion_gestor_carga_moneda_id,
            condicion_gestor_carga_tarifa: data.condicion_gestor_carga_tarifa,
            condicion_gestor_carga_unidad_id:
              data.condicion_gestor_carga_unidad_id,
            // fin - Condiciones para el Gestor de Carga
            // inicio - Condiciones para el Propietario
            condicion_propietario_moneda_id:
              data.condicion_propietario_moneda_id,
            condicion_propietario_tarifa: data.condicion_propietario_tarifa,
            condicion_propietario_unidad_id:
              data.condicion_propietario_unidad_id,
            // fin - Condiciones para el Propietario
          },
          merma: {
            // inicio - Mermas para el Gestor de Carga
            merma_gestor_carga_valor: data.merma_gestor_carga_valor,
            merma_gestor_carga_moneda_id: data.merma_gestor_carga_moneda_id,
            merma_gestor_carga_unidad_id: data.merma_gestor_carga_unidad_id,
            merma_gestor_carga_es_porcentual:
              data.merma_gestor_carga_es_porcentual,
            merma_gestor_carga_tolerancia: data.merma_gestor_carga_tolerancia,
            // fin - Mermas para el Gestor de Carga
            // inicio - Mermas para el Propietario
            merma_propietario_valor: data.merma_propietario_valor,
            merma_propietario_moneda_id: data.merma_propietario_moneda_id,
            merma_propietario_unidad_id: data.merma_propietario_unidad_id,
            merma_propietario_es_porcentual:
              data.merma_propietario_es_porcentual,
            merma_propietario_tolerancia: data.merma_propietario_tolerancia,
            // fin - Mermas para el Propietario
          },
          emision_orden: {
            emision_orden_texto_legal: data.emision_orden_texto_legal,
            emision_orden_detalle: data.emision_orden_detalle,
            destinatarios: data.destinatarios,
          },
          // vigencia_anticipos: data.vigencia_anticipos,
          complementos: [],
          descuentos: [],
        });
        this.anticipoList = data.anticipos.slice();
        this.complementoList = data.complementos.slice();
        this.descuentoList = data.descuentos.slice();
        setTimeout(() => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
        }, 500);
      });
    }
  }
}
