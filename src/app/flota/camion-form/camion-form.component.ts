import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { PermisoAccionEnum as a, PermisoAccionEnum, PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { CamionService } from 'src/app/services/camion.service';
import { UserService } from 'src/app/services/user.service';
import { confirmationDialogToActive, confirmationDialogToInactive } from 'src/app/utils/change-status';
import { openSnackbar } from 'src/app/utils/snackbar';
import { DateValidator } from 'src/app/validators/date-validator';

@Component({
  selector: 'app-camion-form',
  templateUrl: './camion-form.component.html',
  styleUrls: ['./camion-form.component.scss']
})
export class CamionFormComponent implements OnInit, OnDestroy {

  a = PermisoAccionEnum;
  id?: number;
  propietarioId?: number;
  estado = EstadoEnum.PENDIENTE;
  isActive = false;
  isEdit = false;
  isShow = false;
  isPanelOpen = false;
  isInfoTouched = true;
  isHabilitacionTouched = false;
  isDetalleTouched = false;
  isCapacidadTouched = false;
  backUrl = `/flota/${m.CAMION}/${a.LISTAR}`;
  modelo = m.CAMION;
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
      chofer_id: [null, Validators.required],
      numero_chasis: [null, Validators.required],
      foto: null,
    }),
    municipal: this.fb.group({
      pais_habilitacion_municipal_id: [null, Validators.required],
      localidad_habilitacion_municipal_id: [null, Validators.required],
      ciudad_habilitacion_municipal_id: [null, Validators.required],
      numero_habilitacion_municipal: [null, Validators.required],
      vencimiento_habilitacion_municipal: [null, DateValidator.date],
      foto_habilitacion_municipal_frente: null,
      foto_habilitacion_municipal_reverso: null,
    }),
    transporte: this.fb.group({
      ente_emisor_transporte_id: [null, Validators.required],
      numero_habilitacion_transporte: [null, Validators.required],
      vencimiento_habilitacion_transporte: [null, DateValidator.date],
      foto_habilitacion_transporte_frente: null,
      foto_habilitacion_transporte_reverso: null,
    }),
    automotor: this.fb.group({
      ente_emisor_automotor_id: [null, Validators.required],
      titular_habilitacion_automotor: [null, Validators.required],
      foto_habilitacion_automotor_frente: null,
      foto_habilitacion_automotor_reverso: null,
    }),
    detalle: this.fb.group({
      marca_id: [null, Validators.required],
      tipo_id: [null, Validators.required],
      color_id: [null, Validators.required],
      anho: [null, Validators.required],
    }),
    capacidad: this.fb.group({
      bruto: [null, Validators.required],
      tara: [null, Validators.required],
    }),
  });

  initialFormValue = this.form.value;
  hasChange = false;
  hasChangeSubscription = this.form.valueChanges.subscribe(value => {
    setTimeout(() => {
      this.hasChange = !isEqual(this.initialFormValue, value);
    });
  });

  get puedeModificar(): boolean {
    if (this.isShow || !this.isEdit) { return false; }
    return this.userService.checkPermisoAndGestorCargaId(a.EDITAR, this.modelo, this.gestorCuentaId);
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
    private camionService: CamionService,
    private userService: UserService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

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
    confirmationDialogToActive(this.dialog, 'el Camión', this.camionService, this.id!, this.snackbar, {
      next: () => { this.getData(); }
    });
  }

  inactive(): void {
    confirmationDialogToInactive(this.dialog, 'el Camión', this.camionService, this.id!, this.snackbar, {
      next: () => { this.getData(); }
    });
  }

  submit(confirmed: boolean): void {
    this.isInfoTouched = false;
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const formData = new FormData();
      const data = JSON.parse(JSON.stringify({
        ...this.info.value,
        ...this.habilitacionMunicipal.value,
        ...this.habilitacionTransporte.value,
        ...this.habilitacionAutomotor.value,
        ...this.detalle.value,
        ...this.capacidad.value,
      }));
      delete data.logo;
      formData.append('data', JSON.stringify(data));
      if (this.fotoFile) { formData.append('foto_file', this.fotoFile); }
      if (this.fotoMunicipalFrenteFile) { formData.append('foto_habilitacion_municipal_frente_file', this.fotoMunicipalFrenteFile); }
      if (this.fotoMunicipalReversoFile) { formData.append('foto_habilitacion_municipal_reverso_file', this.fotoMunicipalReversoFile); }
      if (this.fotoTransporteFrenteFile) { formData.append('foto_habilitacion_transporte_frente_file', this.fotoTransporteFrenteFile); }
      if (this.fotoTransporteReversoFile) { formData.append('foto_habilitacion_transporte_reverso_file', this.fotoTransporteReversoFile); }
      if (this.fotoAutomotorFrenteFile) { formData.append('foto_habilitacion_automotor_frente_file', this.fotoAutomotorFrenteFile); }
      if (this.fotoAutomotorReversoFile) { formData.append('foto_habilitacion_automotor_reverso_file', this.fotoAutomotorReversoFile); }
      if (this.isEdit && this.id) {
        this.camionService.edit(this.id, formData).subscribe(() => {
          this.getData();
          openSnackbar(this.snackbar, confirmed, this.router, this.backUrl);
        });
      } else {
        this.camionService.create(formData).subscribe((camion) => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
          this.snackbar
            .open('Datos guardados satisfactoriamente', 'Ok')
            .afterDismissed()
            .subscribe(() => {
              if (confirmed) {
                this.router.navigate([this.backUrl]);
              } else {
                this.router.navigate([`/flota/${m.CAMION}/${a.EDITAR}`, camion.id]);
              }
            });
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
      this.isEdit = /edit/.test(this.router.url);
      this.isShow = /ver/.test(this.router.url);
      if (this.isShow) {
        this.form.disable();
      }
      this.camionService.getById(this.id).subscribe(data => {
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
            chofer_id: data.chofer_id,
            numero_chasis: data.numero_chasis,
            foto: null,
          },
          municipal: {
            pais_habilitacion_municipal_id: data.ciudad_habilitacion_municipal.localidad.pais_id,
            localidad_habilitacion_municipal_id: data.ciudad_habilitacion_municipal.localidad_id,
            ciudad_habilitacion_municipal_id: data.ciudad_habilitacion_municipal_id,
            numero_habilitacion_municipal: data.numero_habilitacion_municipal,
            vencimiento_habilitacion_municipal: data.vencimiento_habilitacion_municipal,
            foto_habilitacion_municipal_frente: null,
            foto_habilitacion_municipal_reverso: null,
          },
          transporte: {
            ente_emisor_transporte_id: data.ente_emisor_transporte_id,
            numero_habilitacion_transporte: data.numero_habilitacion_transporte,
            vencimiento_habilitacion_transporte: data.vencimiento_habilitacion_transporte,
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
            tipo_id: data.tipo_id,
            color_id: data.color_id,
            anho: data.anho,
          },
          capacidad: {
            bruto: data.bruto,
            tara: data.tara,
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
