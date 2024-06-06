import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { AuditDatabase } from 'src/app/interfaces/audit-database';
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
import { OrdenCargaService } from 'src/app/services/orden-carga.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRouteService } from 'src/app/services/activated-route.service';

@Component({
  selector: 'app-orden-carga-edit-form',
  templateUrl: './orden-carga-edit-form.component.html',
  styleUrls: ['./orden-carga-edit-form.component.scss'],
})
export class OrdenCargaEditFormComponent implements OnInit, OnDestroy {
  a = PermisoAccionEnum;
  id!: number;
  isEdit = false;
  isCombinacionTouched = true;
  isInfoTouched = false;
  isTramoTouched = false;
  backUrl = `/orden-carga/${m.ORDEN_CARGA}/${a.LISTAR}`;
  modelo = m.ORDEN_CARGA;
  item?: OrdenCarga;
  flete?: FleteList;
  formDisabledTime = new Date();

  form = this.fb.group({
    combinacion: this.fb.group({
      flete_id: [null, Validators.required],
      camion_id: [null, Validators.required],
      semi_id: [null, Validators.required],
    }),
    info: this.fb.group({
      cantidad_nominada: [null, Validators.required],
      comentarios: null,
    }),
    tramo: this.fb.group({
      flete_origen_id: null,
      flete_destino_id: null,
      origen_id: null,
      destino_id: null,
    }),
    porcentaje_anticipos: this.fb.array([]),
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

  get estado(): EstadoEnum {
    return this.item!.estado;
  }

  get gestorCargaId(): number | undefined {
    return this.item?.gestor_carga_id;
  }

  get isAnticiposLiberados(): boolean {
    return this.item!.anticipos_liberados;
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
    // private route: ActivatedRoute,
    private route: ActivatedRouteService,
    private router: Router,
    private chRef: ChangeDetectorRef
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

  back(confirmed: boolean): void {
    if (confirmed) {
      this.submit(confirmed);
    } else {
      this.router.navigate([this.backUrl]);
    }
  }

  onFleteChange(flete: FleteList | undefined): void {
    if (flete) {
      this.flete = flete;
      this.chRef.detectChanges();
    }
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

  getData(): void {
    const backUrl = this.route.snapshot.queryParams.backUrl;
    if (backUrl) {
      this.backUrl = backUrl;
    }
    this.id = +this.route.snapshot.params.id;
    // this.isEdit = /edit/.test(this.router.url);
    this.isEdit = /edit/.test(this.route.url);
    this.ordenCargaService.getById(this.id).subscribe((data) => {
      this.item = data;
      this.form.patchValue({
        combinacion: {
          flete_id: data.flete_id,
          camion_id: data.camion_id,
          semi_id: data.semi_id,
        },
        info: {
          cantidad_nominada: data.cantidad_nominada,
          comentarios: data.comentarios,
        },
        tramo: {
          flete_origen_id: data.flete_origen_id,
          flete_destino_id: data.flete_destino_id,
          origen_id: data.origen_id,
          destino_id: data.destino_id,
        },
      });
      this.combinacion.get('flete_id')!.disable();
      this.combinacion.get('camion_id')!.disable();
      if (!this.puedeModificar) {
        this.form.disable();
        this.formDisabledTime = new Date();
      }
      setTimeout(() => {
        this.hasChange = false;
        this.initialFormValue = this.form.value;
      }, 500);
    });
  }
}
