import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual, unset } from 'lodash';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { FleteCantidadCondicionesDialogComponent } from 'src/app/dialogs/flete-cantidad-condiciones-dialog/flete-cantidad-condiciones-dialog.component';
import { FleteConfirmationDialogComponent } from 'src/app/dialogs/flete-confirmation-dialog/flete-confirmation-dialog.component';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoAccionEnum,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as r,
} from 'src/app/enums/permiso-enum';
import { getFleteData } from 'src/app/form-data/flete-confirmation-data';
import { ConfirmationDialogData } from 'src/app/interfaces/confirmation-dialog-data';
import { Flete } from 'src/app/interfaces/flete';
import { FleteAnticipo } from 'src/app/interfaces/flete-anticipo';
import { FleteComplemento } from 'src/app/interfaces/flete-complemento';
import { FleteConfirmationDialogData } from 'src/app/interfaces/flete-confirmation-dialog-data';
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
  isEditPressed= false
  isEditCopyForm = false;
  isCopyFlete = false;
  isShowCopiedFlete = false;
  hasSavedSuccessfully = false;
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

  /*  collapside */
  colapseDivTramo = false;
  colapseDivCantidad = false;
  colapseDivMerma = false;
  colapseDivAnticipo = false;
  colapseDivComplemento = false;
  colapseDivEmision = false;

  form = this.fb.group({
    info: this.fb.group({
      remitente_id: [null, Validators.required],
      remitente_nombre: null,
      producto_id: [null, Validators.required],
      producto_descripcion: null,
      tipo_carga_id: [null, Validators.required],
      tipo_carga: [' '],
      numero_pedido: null,
      // publicado: true,
      // es_subasta: false,
    }),
    tramo: this.fb.group({
      origen_id: [null, Validators.required],
      origen_nombre: null,
      origen_indicacion: null,
      destino_id: [null, Validators.required],
      destino_nombre: [null, Validators.required],
      destino_indicacion: null,
      // distancia: null,
    }),
    condicion: this.fb.group({
      condicion_cantidad: [null, Validators.required],
      saldo: [{ value: null, disabled: true }],
      cargado: [{ value: null, disabled: true }],
      // inicio - Condiciones para el Gestor de Carga
      condicion_gestor_carga_moneda: [null],
      condicion_gestor_carga_moneda_id: [null, Validators.required],
      condicion_gestor_carga_moneda_simbolo: null,
      condicion_gestor_carga_tarifa: [null, Validators.required],
      //condicion_gestor_carga_unidad: [null, Validators.required],
      condicion_gestor_carga_unidad_id: [null],
      condicion_gestor_carga_unidad_abreviatura: null,
      // fin - Condiciones para el Gestor de Carga
      // inicio - Condiciones para el Propietario
      condicion_propietario_moneda: [null],
      condicion_propietario_moneda_id: [null, Validators.required],
      condicion_propietario_moneda_simbolo: null,
      condicion_propietario_tarifa: [null, Validators.required],
      //condicion_propietario_unidad: [null],
      condicion_propietario_unidad_id: [null, Validators.required],
      condicion_propietario_unidad_abreviatura: null,
      // fin - Condiciones para el Propietario
    }),
    merma: this.fb.group({
      // inicio - Mermas para el Gestor de Carga
      merma_gestor_carga_valor: [null, Validators.required],
      merma_gestor_carga_moneda: [null],
      merma_gestor_carga_moneda_id: [null, Validators.required],
      merma_gestor_carga_moneda_simbolo: null,
      //merma_gestor_carga_unidad: [null, Validators.required],
      merma_gestor_carga_unidad_id: [null],
      merma_gestor_carga_unidad_abreviatura: null,
      merma_gestor_carga_es_porcentual: true,
      merma_gestor_carga_tolerancia: [null, Validators.required],
      // fin - Mermas para el Gestor de Carga
      // inicio - Mermas para el Propietario
      merma_propietario_valor: [null, Validators.required],
      merma_propietario_moneda: [null],
      merma_propietario_moneda_id: [null, Validators.required],
      merma_propietario_moneda_simbolo: null,
      //merma_propietario_unidad: [null, Validators.required],
      merma_propietario_unidad_id: [null],
      merma_propietario_unidad_abreviatura: null,
      merma_propietario_es_porcentual: true,
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
    if (this.isShow || !this.isEdit || this.isEditCopyForm) {
      return false;
    }
    return this.userService.checkPermisoAndGestorCargaId(
      a.EDITAR,
      this.modelo,
      this.gestorCargaId
    );
  }

  @Input() flete?: Flete;

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
    private matSnackbar: MatSnackBar,
    private dialog: DialogService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
    this.route.queryParams.subscribe(params => {
      if (params['isCopied'] === 'true') {
        this.isShowCopiedFlete = true;
        this.id = this.route.snapshot.params['id'];
      }
      });
  }

  ngOnDestroy(): void {
    this.hasChangeSubscription.unsubscribe();
  }

  fnHideCancelado(): boolean {
     return this.item?.estado === EstadoEnum.CANCELADO;
  }

  fnHideIsInOc(): boolean {
    return !(this.item?.is_in_orden_carga);
  }

  redirectToEdit(): void {
    this.router.navigate([`/flete/${m.FLETE}/${a.EDITAR}`, this.id]);
  }

  cancelar(): void {
    this.dialog.changeStatusConfirm(
      '¿Está seguro que desea cancelar el Pedido?',
      this.fleteService.cancel(this.id!),
      () => {
        this.getData();
      }
    );
  }

  onEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      event.preventDefault();
    }
  }

  back(): void {
    if (this.isShow) {
      this.router.navigate([this.backUrl]);
      return;
    }
    if (this.hasSavedSuccessfully) {
      this.router.navigate([this.backUrl]);
      return;
    }
    const dialogData: ConfirmationDialogData = {
      title: '¿Salir sin guardar?',
      message: 'Está copiando un Pedido. ¿Desea salir sin guardar?',
      closeButtonText: 'No',
      confirmedButtonText: 'Sí',
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((confirmExit) => {
      if (confirmExit) {
        if (this.isShowCopiedFlete && this.id) {
          this.fleteService.delete(this.id).subscribe({
            next: () => {
              this.router.navigate([this.backUrl]);
            },
            error: (err) => {
              console.error('Error al eliminar el flete:', err);
              this.router.navigate([this.backUrl]);
            }
          });
        } else {
          this.router.navigate([this.backUrl]);
        }
      }
    });
  }

  copiar() {
    this.isEditPressed = false;
    this.isEditCopyForm = false;
    this.isCopyFlete = true;

    this.form.enable();

    const copiedData = {
      ...this.info.value,
      ...this.tramo.value,
      ...this.condicion.value,
      ...this.merma.value,
      ...this.emisionOrden.value,
      anticipos: this.anticipos.value,
      complementos: this.complementos.value,
      descuentos: this.descuentos.value,
    };

    delete copiedData.id;
    delete copiedData.createdAt;
    delete copiedData.updatedAt;

    this.info.patchValue(copiedData);
    this.tramo.patchValue(copiedData);
    this.condicion.patchValue(copiedData);
    this.merma.patchValue(copiedData);
    this.emisionOrden.patchValue(copiedData);
    this.isEdit = true;
  }

  isShowCopiar() {
    this.isEditPressed = false;
    this.isEditCopyForm = false;
    this.isCopyFlete = this.isShow;

    this.form.enable();

    const data = {
      ...this.info.value,
      ...this.tramo.value,
      ...this.condicion.value,
      ...this.merma.value,
      ...this.emisionOrden.value,
      anticipos: this.anticipos.value,
      complementos: this.complementos.value,
      descuentos: this.descuentos.value,
    };

    // Convertir a mayúsculas (excepto email)
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'string' && key !== 'email') {
        data[key] = data[key].toUpperCase();
      }
    });

    const formData = new FormData();
    formData.append('data', JSON.stringify(data));

    this.fleteService.create(formData).subscribe((flete) => {
    this.id = flete.id;
      this.router.navigate(
        [`/flete/${m.FLETE}/${a.EDITAR}`, flete.id],
        { queryParams: { isCopied: 'true' } }
      );
    });
  }


  private copiarFlete(originalId: number): void {
    const formData = new FormData();
    const data = {
      ...this.info.value,
      ...this.tramo.value,
      ...this.condicion.value,
      ...this.merma.value,
      ...this.emisionOrden.value,
      anticipos: this.anticipos.value,
      complementos: this.complementos.value,
      descuentos: this.descuentos.value,
    };

    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'string' && key !== 'email') {
        data[key] = data[key].toUpperCase();
      }
    });

    formData.append('data', JSON.stringify(data));

    this.fleteService.create(formData).subscribe((flete) => {
      this.matSnackbar.open('Pedido copiado y guardado como nuevo.', 'Cerrar', {
        duration: 3000,
      });

      this.router.navigate([`/flete/${m.FLETE}/${a.EDITAR}`, flete.id]);

      const dialogData: ConfirmationDialogData = {
        title: '¿Quieres cancelar el pedido original?',
        message: 'Si confirma, el pedido original será cancelado.',
        closeButtonText: 'No',
        confirmedButtonText: 'Sí',
      };

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: dialogData
      });

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.fleteService.cancel(originalId!).subscribe(() => {
            this.getData();
            this.matSnackbar.open(
              'Pedido original cancelado correctamente.',
              'Cerrar',
              { duration: 3000 }
            );
          });
        }
      });

      this.id = flete.id;
    });
  }

  ampliar() {
    this.isShow = false;
    this.form.enable()
    const dialogRef = this.dialog.open(FleteCantidadCondicionesDialogComponent, {
      panelClass: 'half-dialog',
      data: {
        form: this.form
      }
    });

    dialogRef.afterClosed().subscribe((result: { form: FormGroup } | undefined) => {
      if (result?.form?.valid) {
        const id = result.form.get('id')?.value;
        const cantidad = result.form.get('condicion_cantidad')?.value;

        if (id && cantidad !== undefined) {
          this.fleteService.updateCantidad(id, cantidad).subscribe({
            next: (fleteActualizado) => {
              this.form.patchValue({
                condicion_cantidad: fleteActualizado.condicion_cantidad
              });
            },
            error: (err) => {
              console.error('Error actualizando cantidad:', err);
            }
          });
        }
      }
    });
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
          panelClass: 'preview-width-dialog',
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
        anticipos: this.anticipos.value,
        complementos: this.complementos.value,
        descuentos: this.descuentos.value,
      })
    );
    if (this.isCopyFlete) {
      ['anticipos', 'complementos', 'descuentos'].forEach((lista) => {
        if (Array.isArray(data[lista])) {
          data[lista] = data[lista].map((item: any) => {
            if (item && typeof item === 'object') {
              const newItem = { ...item };
              delete newItem.id;
              return newItem;
            }
            return item;
          });
        }
      });
    }
    // Convertir strings a mayúsculas salvo email
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'string' && key !== 'email') {
        data[key] = data[key].toUpperCase();
      }
    });

    formData.append('data', JSON.stringify(data));
    this.hasChange = false;
    this.initialFormValue = this.form.value;

    if (this.isEdit && this.id && !this.isCopyFlete) {

      this.fleteService.edit(this.id, formData).subscribe(() => {
        this.snackbar.openUpdateAndRedirect(confirmed, this.backUrl);
        this.hasSavedSuccessfully = true;
        this.getData();
      });
    } else {
      this.fleteService.create(formData).subscribe((flete) => {
        const url = `/flete/${m.FLETE}/${a.VER}/${flete.id}`;
        this.snackbar.openSaveAndRedirect(
          true,
          url,
          r.FLETE,
          m.FLETE,
          flete.id
        );
        this.isCopyFlete = false;
        this.hasSavedSuccessfully = true;
      });
    }
  }

  productoChangeEvent(producto:any):void {
    this.info.get('producto_descripcion')?.setValue(producto?.descripcion);
    this.info.get('tipo_carga_id')?.setValue(producto?.tipo_carga.id);
    if (producto) this.info.get('tipo_carga')?.setValue(producto?.tipo_carga.descripcion);
  }

  remitenteChangeInfo(remitente:any):void {
    this.info.get('remitente_nombre')?.setValue(remitente?.nombre)
  }

  getData(): void {
    const backUrl = this.route.snapshot.queryParams.backUrl;
    if (backUrl) {
      this.backUrl = backUrl;
    }
    this.propietarioId = +this.route.snapshot.queryParams.propietarioId;
    this.id = +this.route.snapshot.params.id;

    if (this.id) {
      this.isEdit = /edit/.test(this.router.url);
      this.isShow = /ver/.test(this.router.url);

      this.fleteService.getById(this.id).subscribe((data) => {
        this.item = data;
        this.estado = data.estado;
        this.isCancel = data.estado === EstadoEnum.CANCELADO;
        this.gestorCargaId = data.gestor_carga_id;
        this.created_by = data.created_by;
        this.created_at = data.created_at;
        this.modified_by = data.modified_by;
        this.modified_at = data.modified_at;

        if (this.isEdit && data.is_in_orden_carga) {
          this.matSnackbar.open(
            'Este pedido no se puede editar porque ya está relacionado con una orden de carga.',
            'Cerrar',
            { duration: 5000 }
          );
          this.isEditCopyForm = true;
          this.isEditPressed = true;
          this.form.disable();
        } else if (!this.puedeModificar) {
          this.form.disable();
        }

        this.form.patchValue({
          info: {
            remitente_id: data.remitente_id,
            producto_id: data.producto_id,
            tipo_carga_id: data.tipo_carga_id,
            numero_pedido: data.id,
          },
          tramo: {
            origen_id: data.origen_id,
            origen_indicacion: data.origen_indicacion,
            destino_id: data.destino_id,
            destino_indicacion: data.destino_indicacion,
          },
          condicion: {
            condicion_cantidad: data.condicion_cantidad,
            saldo: data.saldo,
            cargado: data.cargado,
            condicion_gestor_carga_moneda_id: data.condicion_gestor_carga_moneda_id,
            condicion_gestor_carga_tarifa: data.condicion_gestor_carga_tarifa,
            condicion_gestor_carga_unidad: data.condicion_gestor_carga_unidad,
            condicion_gestor_carga_unidad_id: data.condicion_gestor_carga_unidad_id,
            condicion_propietario_moneda_id: data.condicion_propietario_moneda_id,
            condicion_propietario_tarifa: data.condicion_propietario_tarifa,
            condicion_propietario_unidad: data.condicion_propietario_unidad,
            condicion_propietario_unidad_id: data.condicion_propietario_unidad_id,
          },
          merma: {
            merma_gestor_carga_valor: data.merma_gestor_carga_valor,
            merma_gestor_carga_moneda_id: data.merma_gestor_carga_moneda_id,
            merma_gestor_carga_unidad_id: data.merma_gestor_carga_unidad_id,
            merma_gestor_carga_es_porcentual: data.merma_gestor_carga_es_porcentual,
            merma_gestor_carga_tolerancia: data.merma_gestor_carga_tolerancia,
            merma_propietario_valor: data.merma_propietario_valor,
            merma_propietario_moneda_id: data.merma_propietario_moneda_id,
            merma_propietario_unidad_id: data.merma_propietario_unidad_id,
            merma_propietario_es_porcentual: data.merma_propietario_es_porcentual,
            merma_propietario_tolerancia: data.merma_propietario_tolerancia,
          },
          emision_orden: {
            emision_orden_texto_legal: data.emision_orden_texto_legal,
            emision_orden_detalle: data.emision_orden_detalle,
            destinatarios: data.destinatarios,
          },
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
