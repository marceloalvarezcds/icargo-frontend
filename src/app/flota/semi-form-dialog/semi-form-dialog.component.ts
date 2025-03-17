import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
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
import { Semi } from 'src/app/interfaces/semi';
import { DialogService } from 'src/app/services/dialog.service';
import { PropietarioService } from 'src/app/services/propietario.service';
import { SemiService } from 'src/app/services/semi.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { DateValidator } from 'src/app/validators/date-validator';

@Component({
  selector: 'app-semi-form-dialog',
  templateUrl: './semi-form-dialog.component.html',
  styleUrls: ['./semi-form-dialog.component.scss']
})
export class SemiFormDialogComponent implements OnInit {

  a = PermisoAccionEnum;
  id?: number;
  item?: Semi;
  isShowBtn?: boolean = false;
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
  isDialog: boolean = false;
  groupName = 'info';

  form = this.fb.group({
    info: this.fb.group({
      placa: [null, Validators.required],
      propietario_id: [null, Validators.required],
      propietario_nombre: [{ value: null, disabled: true }],
      // numero_chasis: null,
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
      foto_habilitacion_transporte_frente: [null, Validators.required],
      foto_habilitacion_transporte_reverso: [null, Validators.required],
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
      numero_chasis: null,
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

   @Output() dataSemiSaved = new EventEmitter<void>();

  get actionText(): string {
    if (this.isShow) {
      return 'VER';
    }
    return this.isEdit ? 'EDITAR' : 'NUEVO';
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

  get data(): Semi | undefined {
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

  get capacidad(): FormGroup {
    return this.form.get('capacidad') as FormGroup;
  }

  constructor(
    private fb: FormBuilder,
    private semiService: SemiService,
    private propietarioService: PropietarioService,
    private userService: UserService,
    private snackbar: SnackbarService,
    private dialog: DialogService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<SemiFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) { this.isEdit = dialogData.isEdit;
      this.isShow = dialogData.isShow;
    }

  ngOnInit(): void {
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

      this.semiService.getById(this.dialogData.camionId).subscribe((semi) => {
        if (semi) {
          this.form.get('info.placa')?.setValue(semi.placa || null);
          this.form.get('info.foto')?.setValue(semi.foto || null);

          this.form.get('detalle.marca_id')?.setValue(semi.marca_id || null);
          this.form.get('detalle.color_id')?.setValue(semi.color_id || null);
          this.form.get('detalle.tipo_carga_id')?.setValue(semi.tipo_carga_id || null);
          this.form.get('detalle.tipo_id')?.setValue(semi.tipo_id || null);
          this.form.get('detalle.clasificacion_id')?.setValue(semi.clasificacion_id || null);
          this.form.get('detalle.anho')?.setValue(semi.anho || null);
          this.form.get('detalle.numero_chasis')?.setValue(semi.numero_chasis || null);

          this.form.get('capacidad.tara')?.setValue(semi.tara || null);
          this.form.get('capacidad.bruto')?.setValue(semi.bruto || null);

          this.form.get('transporte.ente_emisor_transporte_id')?.setValue(semi.ente_emisor_transporte_id || null);
          this.form.get('transporte.numero_habilitacion_transporte')?.setValue(semi.numero_habilitacion_transporte || null);
          this.form.get('transporte.vencimiento_habilitacion_transporte')?.setValue(semi.vencimiento_habilitacion_transporte || null);
          this.form.get('transporte.foto_habilitacion_transporte_frente')?.setValue(semi.foto_habilitacion_transporte_frente || null);
          this.form.get('transporte.foto_habilitacion_transporte_reverso')?.setValue(semi.foto_habilitacion_transporte_reverso || null);

          this.form.get('municipal.pais_habilitacion_municipal_id')?.setValue(semi.pais_habilitacion_municipal_id || null);
          this.form.get('municipal.localidad_habilitacion_municipal_id')?.setValue(semi.localidad_habilitacion_municipal_id || null);
          this.form.get('municipal.ciudad_habilitacion_municipal_id')?.setValue(semi.ciudad_habilitacion_municipal_id || null);
          this.form.get('municipal.numero_habilitacion_municipal')?.setValue(semi.numero_habilitacion_municipal || null);
          this.form.get('municipal.vencimiento_habilitacion_municipal')?.setValue(semi.vencimiento_habilitacion_municipal || null);
          this.form.get('municipal.vencimiento_habilitacion_municipal')?.setValue(semi.vencimiento_habilitacion_municipal || null);
          this.form.get('municipal.foto_habilitacion_municipal_frente')?.setValue(semi.foto_habilitacion_municipal_frente || null);
          this.form.get('municipal.foto_habilitacion_municipal_reverso')?.setValue(semi.foto_habilitacion_municipal_reverso || null);

          this.form.get('automotor.ente_emisor_automotor_id')?.setValue(semi.ente_emisor_automotor_id || null);
          this.form.get('automotor.titular_habilitacion_automotor')?.setValue(semi.titular_habilitacion_automotor || null);
          this.form.get('automotor.foto_habilitacion_automotor_frente')?.setValue(semi.foto_habilitacion_automotor_frente || null);
          this.form.get('automotor.foto_habilitacion_automotor_reverso')?.setValue(semi.foto_habilitacion_automotor_reverso || null);
        }
      });
    }
  }

  fotoChangeHandler(file: File | null): void {
    if (file) {
      this.fotoFile = file;
    } else {
      this.fotoFile = null;
    }
  }

  active(): void {
    this.dialog.changeStatusConfirm(
      '¿Está seguro que desea activar el Semi?',
      this.semiService.active(this.id!),
      () => {

      }
    );
  }

  inactive(): void {
    this.dialog.changeStatusConfirm(
      '¿Está seguro que desea desactivar el Semi',
      this.semiService.inactive(this.id!),
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
        this.semiService
          .edit(this.data!.id, formData)
          .subscribe(() => {
            this.close();
            this.dataSemiSaved.emit(data);

          });
      } else {
        this.semiService
          .create(formData)
          .subscribe(() => {
            this.close();
            this.dataSemiSaved.emit(data);
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


  close(): void {
    this.dialogRef.close();
  }

}
