import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { FleteAnticipo } from 'src/app/interfaces/flete-anticipo';
import { FleteComplemento } from 'src/app/interfaces/flete-complemento';
import { FleteDescuento } from 'src/app/interfaces/flete-descuento';
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
      producto_id: [null, Validators.required],
      tipo_carga_id: null,
      numero_lote: [null, Validators.required],
      publicado: true,
      es_subasta: false,
    }),
    tramo: this.fb.group({
      origen_id: [null, Validators.required],
      origen_indicacion: null,
      destino_id: [null, Validators.required],
      destino_indicacion: null,
      distancia: null,
    }),
    condicion: this.fb.group({
      condicion_cantidad: [null, Validators.required],
      // inicio - Condiciones para el Gestor de Cuenta
      condicion_gestor_cuenta_moneda_id: [null, Validators.required],
      condicion_gestor_cuenta_tarifa: [null, Validators.required],
      condicion_gestor_cuenta_unidad_id: [null, Validators.required],
      // fin - Condiciones para el Gestor de Cuenta
      // inicio - Condiciones para el Propietario
      condicion_propietario_moneda_id: [null, Validators.required],
      condicion_propietario_tarifa: [null, Validators.required],
      condicion_propietario_unidad_id: [null, Validators.required],
      // fin - Condiciones para el Propietario
    }),
    merma: this.fb.group({
      // inicio - Mermas para el Gestor de Cuenta
      merma_gestor_cuenta_valor: [null, Validators.required],
      merma_gestor_cuenta_moneda_id: [null, Validators.required],
      merma_gestor_cuenta_unidad_id: [null, Validators.required],
      merma_gestor_cuenta_es_porcentual: false,
      merma_gestor_cuenta_tolerancia: [null, Validators.required],
      // fin - Mermas para el Gestor de Cuenta
      // inicio - Mermas para el Propietario
      merma_propietario_valor: [null, Validators.required],
      merma_propietario_moneda_id: [null, Validators.required],
      merma_propietario_unidad_id: [null, Validators.required],
      merma_propietario_es_porcentual: false,
      merma_propietario_tolerancia: [null, Validators.required],
      // fin - Mermas para el Propietario
    }),
    vigencia_anticipos: [null, Validators.required],
    anticipos: this.fb.array([], {
      validators: ProportionValidator.max(100, 'porcentaje'),
    }),
    complementos: this.fb.array([]),
    descuentos: this.fb.array([]),
    emision_orden: this.fb.group({
      emision_orden_texto_legal: [null, Validators.required],
      emision_orden_detalle: null,
      destinatarios: [null, Validators.required],
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
    private route: ActivatedRoute,
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
      this.submit(confirmed);
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
          ...this.condicion.value,
          ...this.merma.value,
          ...this.emisionOrden.value,
          vigencia_anticipos: this.form.value.vigencia_anticipos,
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
          this.snackbar.openSaveAndRedirect(confirmed, this.backUrl, [
            `/flete/${m.FLETE}/${a.EDITAR}`,
            flete.id,
          ]);
        });
      }
    } else {
      setTimeout(() => {
        const isAnticipoValid = !!this.form.get('vigencia_anticipos')?.invalid;
        this.isInfoTouched = this.info.invalid;
        this.isTramoTouched = this.tramo.invalid;
        this.isCondicionTouched = this.condicion.invalid;
        this.isMermaTouched = this.merma.invalid;
        this.isAnticipoTouched = this.anticipos.invalid || isAnticipoValid;
        this.isComplementoTouched = this.complementos.invalid;
        this.isDescuentoTouched = this.descuentos.invalid;
        this.isEmisionOrdenTouched = this.emisionOrden.invalid;
      });
    }
  }

  private getData(): void {
    const backUrl = this.route.snapshot.queryParams.backUrl;
    if (backUrl) {
      this.backUrl = backUrl;
    }
    this.propietarioId = +this.route.snapshot.queryParams.propietarioId;
    this.id = +this.route.snapshot.params.id;
    if (this.id) {
      this.isEdit = /edit/.test(this.router.url);
      this.isShow = /ver/.test(this.router.url);
      if (this.isShow) {
        this.form.disable();
      }
      this.fleteService.getById(this.id).subscribe((data) => {
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
            // inicio - Condiciones para el Gestor de Cuenta
            condicion_gestor_cuenta_moneda_id:
              data.condicion_gestor_cuenta_moneda_id,
            condicion_gestor_cuenta_tarifa: data.condicion_gestor_cuenta_tarifa,
            condicion_gestor_cuenta_unidad_id:
              data.condicion_gestor_cuenta_unidad_id,
            // fin - Condiciones para el Gestor de Cuenta
            // inicio - Condiciones para el Propietario
            condicion_propietario_moneda_id:
              data.condicion_propietario_moneda_id,
            condicion_propietario_tarifa: data.condicion_propietario_tarifa,
            condicion_propietario_unidad_id:
              data.condicion_propietario_unidad_id,
            // fin - Condiciones para el Propietario
          },
          merma: {
            // inicio - Mermas para el Gestor de Cuenta
            merma_gestor_cuenta_valor: data.merma_gestor_cuenta_valor,
            merma_gestor_cuenta_moneda_id: data.merma_gestor_cuenta_moneda_id,
            merma_gestor_cuenta_unidad_id: data.merma_gestor_cuenta_unidad_id,
            merma_gestor_cuenta_es_porcentual:
              data.merma_gestor_cuenta_es_porcentual,
            merma_gestor_cuenta_tolerancia: data.merma_gestor_cuenta_tolerancia,
            // fin - Mermas para el Gestor de Cuenta
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
          vigencia_anticipos: data.vigencia_anticipos,
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
