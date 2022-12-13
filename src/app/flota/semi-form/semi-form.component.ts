import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isEqual } from 'lodash';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoAccionEnum,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as r,
} from 'src/app/enums/permiso-enum';
import { Semi } from 'src/app/interfaces/semi';
import { ActivatedRouteService } from 'src/app/services/activated-route.service';
import { DialogService } from 'src/app/services/dialog.service';
import { SemiService } from 'src/app/services/semi.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { DateValidator } from 'src/app/validators/date-validator';

@Component({
  selector: 'app-semi-form',
  templateUrl: './semi-form.component.html',
  styleUrls: ['./semi-form.component.scss'],
})
export class SemiFormComponent implements OnInit, OnDestroy {
  a = PermisoAccionEnum;
  id?: number;
  item?: Semi;
  estado = EstadoEnum.PENDIENTE;
  isActive = false;
  propietarioId?: number;
  isEdit = false;
  isShow = false;
  isPanelOpen = false;
  isInfoTouched = true;
  isHabilitacionTouched = false;
  isDetalleTouched = false;
  isCapacidadTouched = false;
  backUrl = `/flota/${m.SEMIRREMOLQUE}/${a.LISTAR}`;
  modelo = m.SEMIRREMOLQUE;
  gestorCuentaId?: number;
  foto: string | null = null;
  fotoFile: File | null = null;
  fotoMunicipalFrente: string | null = null;
  fotoMunicipalFrenteFile: File | null = null;
  fotoMunicipalReverso: string | null = null;
  fotoMunicipalReversoFile: File | null = null;
  fotoTransporteFrente: string | null = null;
  fotoTransporteFrenteFile: File | null = null;
  fotoTransporteReverso: string | null = null;
  fotoTransporteReversoFile: File | null = null;
  fotoAutomotorFrente: string | null = null;
  fotoAutomotorFrenteFile: File | null = null;
  fotoAutomotorReverso: string | null = null;
  fotoAutomotorReversoFile: File | null = null;
  created_by = '';
  created_at = '';
  modified_by = '';
  modified_at = '';

  form = this.fb.group({
    info: this.fb.group({
      placa: [null, Validators.required],
      propietario_id: [null, Validators.required],
      numero_chasis: null,
      foto: null,
    }),
    municipal: this.fb.group({
      pais_habilitacion_municipal_id: null,
      localidad_habilitacion_municipal_id: null,
      ciudad_habilitacion_municipal_id: null,
      numero_habilitacion_municipal: null,
      vencimiento_habilitacion_municipal: [null, DateValidator.date],
      foto_habilitacion_municipal_frente: null,
      foto_habilitacion_municipal_reverso: null,
    }),
    transporte: this.fb.group({
      ente_emisor_transporte_id: null,
      numero_habilitacion_transporte: null,
      vencimiento_habilitacion_transporte: [null, DateValidator.date],
      foto_habilitacion_transporte_frente: null,
      foto_habilitacion_transporte_reverso: null,
    }),
    automotor: this.fb.group({
      ente_emisor_automotor_id: null,
      titular_habilitacion_automotor: null,
      foto_habilitacion_automotor_frente: null,
      foto_habilitacion_automotor_reverso: null,
    }),
    detalle: this.fb.group({
      marca_id: null,
      clasificacion_id: null,
      tipo_id: null,
      tipo_carga_id: null,
      color_id: null,
      anho: null,
    }),
    capacidad: this.fb.group({
      bruto: null,
      tara: null,
      largo: null,
      alto: null,
      ancho: null,
      volumen: null,
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
      this.gestorCuentaId
    );
  }

  get info(): FormGroup {
    return this.form.get('info') as FormGroup;
  }

  get habilitacionMunicipal(): FormGroup {
    return this.form.get('municipal') as FormGroup;
  }

  get habilitacionTransporte(): FormGroup {
    return this.form.get('transporte') as FormGroup;
  }

  get habilitacionAutomotor(): FormGroup {
    return this.form.get('automotor') as FormGroup;
  }

  get detalle(): FormGroup {
    return this.form.get('detalle') as FormGroup;
  }

  get capacidad(): FormGroup {
    return this.form.get('capacidad') as FormGroup;
  }

  constructor(
    private fb: FormBuilder,
    private semiService: SemiService,
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
      this.submit(confirmed);
    } else {
      this.router.navigate([this.backUrl]);
    }
  }

  redirectToEdit(): void {
    this.router.navigate([`/flota/${m.PROPIETARIO}/${a.EDITAR}`, this.id]);
  }

  active(): void {
    this.dialog.changeStatusConfirm(
      '¿Está seguro que desea activar el Semi-remolque?',
      this.semiService.active(this.id!),
      () => {
        this.getData();
      }
    );
  }

  inactive(): void {
    this.dialog.changeStatusConfirm(
      '¿Está seguro que desea desactivar el Semi-remolque?',
      this.semiService.inactive(this.id!),
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
          ...this.habilitacionMunicipal.value,
          ...this.habilitacionTransporte.value,
          ...this.habilitacionAutomotor.value,
          ...this.detalle.value,
          ...this.capacidad.value,
        })
      );
      delete data.logo;
      formData.append('data', JSON.stringify(data));
      if (this.fotoFile) {
        formData.append('foto_file', this.fotoFile);
      }
      if (this.fotoMunicipalFrenteFile) {
        formData.append(
          'foto_habilitacion_municipal_frente_file',
          this.fotoMunicipalFrenteFile
        );
      }
      if (this.fotoMunicipalReversoFile) {
        formData.append(
          'foto_habilitacion_municipal_reverso_file',
          this.fotoMunicipalReversoFile
        );
      }
      if (this.fotoTransporteFrenteFile) {
        formData.append(
          'foto_habilitacion_transporte_frente_file',
          this.fotoTransporteFrenteFile
        );
      }
      if (this.fotoTransporteReversoFile) {
        formData.append(
          'foto_habilitacion_transporte_reverso_file',
          this.fotoTransporteReversoFile
        );
      }
      if (this.fotoAutomotorFrenteFile) {
        formData.append(
          'foto_habilitacion_automotor_frente_file',
          this.fotoAutomotorFrenteFile
        );
      }
      if (this.fotoAutomotorReversoFile) {
        formData.append(
          'foto_habilitacion_automotor_reverso_file',
          this.fotoAutomotorReversoFile
        );
      }
      this.hasChange = false;
      this.initialFormValue = this.form.value;
      if (this.isEdit && this.id) {
        this.semiService.edit(this.id, formData).subscribe(() => {
          this.snackbar.openUpdateAndRedirect(confirmed, this.backUrl);
          this.getData();
        });
      } else {
        this.semiService.create(formData).subscribe((semi) => {
          this.snackbar.openSaveAndRedirect(
            confirmed,
            this.backUrl,
            r.FLOTA,
            m.SEMIRREMOLQUE,
            semi.id
          );
        });
      }
    } else {
      setTimeout(() => {
        this.isInfoTouched = this.info.invalid;
        this.isHabilitacionTouched = this.habilitacionMunicipal.invalid;
        this.isDetalleTouched = this.detalle.invalid;
        this.isCapacidadTouched = this.capacidad.invalid;
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
      this.isEdit = /edit/.test(this.route.url);
      this.isShow = /ver/.test(this.route.url);
      if (this.isShow) {
        this.form.disable();
      }
      this.semiService.getById(this.id).subscribe((data) => {
        this.item = data;
        this.estado = data.estado;
        this.isActive = data.estado === EstadoEnum.ACTIVO;
        this.gestorCuentaId = data.gestor_cuenta_id;
        this.foto = data.foto;
        this.fotoMunicipalFrente = data.foto_habilitacion_municipal_frente;
        this.fotoMunicipalReverso = data.foto_habilitacion_municipal_reverso;
        this.fotoTransporteFrente = data.foto_habilitacion_transporte_frente;
        this.fotoTransporteReverso = data.foto_habilitacion_transporte_reverso;
        this.fotoAutomotorFrente = data.foto_habilitacion_automotor_frente;
        this.fotoAutomotorReverso = data.foto_habilitacion_automotor_reverso;
        this.created_by = data.created_by;
        this.created_at = data.created_at;
        this.modified_by = data.modified_by;
        this.modified_at = data.modified_at;
        if (!this.puedeModificar) {
          this.info.disable();
          this.habilitacionMunicipal.disable();
          this.habilitacionTransporte.disable();
          this.habilitacionAutomotor.disable();
          this.detalle.disable();
          this.capacidad.disable();
        }
        this.form.setValue({
          info: {
            placa: data.placa,
            propietario_id: data.propietario_id,
            numero_chasis: data.numero_chasis,
            foto: null,
          },
          municipal: {
            pais_habilitacion_municipal_id: data.pais_habilitacion_municipal_id,
            localidad_habilitacion_municipal_id:
              data.localidad_habilitacion_municipal_id,
            ciudad_habilitacion_municipal_id:
              data.ciudad_habilitacion_municipal_id,
            numero_habilitacion_municipal: data.numero_habilitacion_municipal,
            vencimiento_habilitacion_municipal:
              data.vencimiento_habilitacion_municipal,
            foto_habilitacion_municipal_frente: null,
            foto_habilitacion_municipal_reverso: null,
          },
          transporte: {
            ente_emisor_transporte_id: data.ente_emisor_transporte_id,
            numero_habilitacion_transporte: data.numero_habilitacion_transporte,
            vencimiento_habilitacion_transporte:
              data.vencimiento_habilitacion_transporte,
            foto_habilitacion_transporte_frente: null,
            foto_habilitacion_transporte_reverso: null,
          },
          automotor: {
            ente_emisor_automotor_id: data.ente_emisor_automotor_id,
            titular_habilitacion_automotor: data.titular_habilitacion_automotor,
            foto_habilitacion_automotor_frente: null,
            foto_habilitacion_automotor_reverso: null,
          },
          detalle: {
            marca_id: data.marca_id,
            clasificacion_id: data.clasificacion_id,
            tipo_id: data.tipo_id,
            tipo_carga_id: data.tipo_carga_id,
            color_id: data.color_id,
            anho: data.anho,
          },
          capacidad: {
            bruto: data.bruto,
            tara: data.tara,
            largo: data.largo,
            alto: data.alto,
            ancho: data.ancho,
            volumen: data.volumen,
          },
        });
        setTimeout(() => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
        }, 500);
      });
    }
  }
}
