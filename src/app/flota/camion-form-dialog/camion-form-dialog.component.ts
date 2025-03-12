import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoAccionEnum,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as r,
} from 'src/app/enums/permiso-enum';
import { CamionList } from 'src/app/interfaces/camion';
import { Combinacion } from 'src/app/interfaces/combinacion';
import { CamionService } from 'src/app/services/camion.service';
import { DialogService } from 'src/app/services/dialog.service';
import { PropietarioService } from 'src/app/services/propietario.service';
import { UserService } from 'src/app/services/user.service';
import { DateValidator } from 'src/app/validators/date-validator';

@Component({
  selector: 'app-camion-form-dialog',
  templateUrl: './camion-form-dialog.component.html',
  styleUrls: ['./camion-form-dialog.component.scss']
})
export class CamionFormDialogComponent implements OnInit {
  a = PermisoAccionEnum;
  id?: number;
  isShowBtn?: boolean = false;
  item: any;
  propietarioId?: number;
  combinacionTracto?: Combinacion;
  estado = EstadoEnum.PENDIENTE;
  isActive = false;
  isEdit = false;
  isShow = false;
  isPanelOpen = false;
  isInfoTouched = true;
  isHabilitacionTouched = false;
  isDetalleTouched = false;
  isLimiteTouched = false;
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
  isDialog: boolean = false;
  groupName = 'info';
  controlName= "propietario_id"

  form = this.fb.group({
    info: this.fb.group({
      placa: [null, Validators.required],
      propietario_id: [null, Validators.required],
      chofer_id: null,
      propietario_nombre: [{ value: null, disabled: true }],
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
      ente_emisor_transporte_id: [null, Validators.required],
      numero_habilitacion_transporte: [null, Validators.required],
      vencimiento_habilitacion_transporte: [null, [Validators.required, DateValidator.date]],
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
      tipo_id: null,
      color_id: null,
      anho: null,
      numero_chasis: null,
    }),
    capacidad: this.fb.group({
      bruto: null,
      tara: null,
    }),
    limite: this.fb.group({
      limite_cantidad_oc_activas: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern('^[0-9]{1,}$'),
        ],
      ],
      limite_monto_anticipos: null,
    }),
  });

  initialFormValue = this.form.value;
  hasChange = false;
  hasChangeSubscription = this.form.valueChanges.subscribe((value) => {
    setTimeout(() => {
      this.hasChange = !isEqual(this.initialFormValue, value);
    });
  });

  @Output() dataCamionSaved = new EventEmitter<void>();

  fotoChangeHandler(file: File | null): void {
    if (file) {
      this.fotoFile = file;
    } else {
      this.fotoFile = null;
    }
  }

  get actionText(): string {
    if (this.isShow) {
      return 'VER';
    }
    return this.isEdit ? 'EDITAR ' : 'NUEVO';
  }

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

  get data(): CamionList | undefined {
    return this.dialogData?.item;
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

  get limite(): FormGroup {
    return this.form.get('limite') as FormGroup;
  }

  get capacidad(): FormGroup {
    return this.form.get('capacidad') as FormGroup;
  }

  constructor(
    private fb: FormBuilder,
    private camionService: CamionService,
    private propietarioService: PropietarioService,
    private userService: UserService,
    private dialog: DialogService,
    public dialogRef: MatDialogRef<CamionFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) { this.isEdit = dialogData.isEdit;
      this.isShow = dialogData.isShow;
    }

  ngOnInit(): void {
    this.isActive = this.item?.estado === 'ACTIVO';
    if (this.dialogData?.propietarioId) {
      this.form.get('info.propietario_id')?.setValue(this.dialogData.propietarioId);
      this.propietarioService.getById(this.dialogData.propietarioId).subscribe((propietario) => {
        if (propietario) {
          this.form.get('info.propietario_nombre')?.setValue(propietario.nombre);
        }
      });
    }
    if (this.isShow) {
      this.form.disable();
      this.isShowBtn = true;
    }
    //FIXME en algun momento, por el apuro se hizo asi
    if (this.isEdit || this.isShow) {

      this.camionService.getById(this.dialogData.camionId).subscribe((camion) => {
        if (camion) {
          this.form.get('info.placa')?.setValue(camion.placa || null);
          this.form.get('info.foto')?.setValue(camion.foto || null);

          this.form.get('detalle.marca_id')?.setValue(camion.marca_id || null);
          this.form.get('detalle.color_id')?.setValue(camion.color_id || null);
          this.form.get('detalle.tipo_id')?.setValue(camion.tipo_id || null);
          this.form.get('detalle.anho')?.setValue(camion.anho || null);
          this.form.get('detalle.numero_chasis')?.setValue(camion.numero_chasis || null);

          this.form.get('capacidad.tara')?.setValue(camion.tara || null);
          this.form.get('capacidad.bruto')?.setValue(camion.bruto || null);

          this.form.get('limite.limite_cantidad_oc_activas')?.setValue(camion.limite_cantidad_oc_activas || null);
          this.form.get('limite.limite_monto_anticipos')?.setValue(camion.limite_monto_anticipos || null);

          this.form.get('transporte.ente_emisor_transporte_id')?.setValue(camion.ente_emisor_transporte_id || null);
          this.form.get('transporte.numero_habilitacion_transporte')?.setValue(camion.numero_habilitacion_transporte || null);
          this.form.get('transporte.vencimiento_habilitacion_transporte')?.setValue(camion.vencimiento_habilitacion_transporte || null);
          this.form.get('transporte.foto_habilitacion_transporte_frente')?.setValue(camion.foto_habilitacion_transporte_frente || null);
          this.form.get('transporte.foto_habilitacion_transporte_reverso')?.setValue(camion.foto_habilitacion_transporte_reverso || null);

        }
      });
    }
  }


  active(): void {
    this.dialog.changeStatusConfirm(
      '¿Está seguro que desea activar el Tracto?',
      this.camionService.active(this.id!),
      () => {

      }
    );
  }

  inactive(): void {
    this.dialog.changeStatusConfirm(
      '¿Está seguro que desea desactivar el Tracto?',
      this.camionService.inactive(this.id!),
      () => {

      }
    );
  }


  submit(): void {
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
          ...this.limite.value,
        })
      );
      // Convertir propiedades a mayúsculas, excepto los correos electrónicos
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string' && key !== 'email') {
          data[key] = data[key].toUpperCase();
        }
      });
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
      if (this.isEdit) {
        this.camionService
          .edit(this.data!.id, formData)
          .subscribe(() => {
            this.close();
            this.dataCamionSaved.emit(data);

          });
      } else {
        this.camionService
          .create(formData)
          .subscribe(() => {
            this.close();
            this.dataCamionSaved.emit(data);
          });
      }
    } else {
      setTimeout(() => {
        this.isInfoTouched = this.info.invalid;
        this.isHabilitacionTouched = this.habilitacionMunicipal.invalid;
        this.isDetalleTouched = this.detalle.invalid;
        this.isLimiteTouched = this.limite.invalid;
        this.isCapacidadTouched = this.capacidad.invalid;
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

}
