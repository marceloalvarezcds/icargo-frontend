import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { ChoferService } from 'src/app/services/chofer.service';
import { DialogService } from 'src/app/services/dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { DateValidator } from 'src/app/validators/date-validator';
import { emailValidator } from 'src/app/validators/email-validator';

@Component({
  selector: 'app-chofer-form',
  templateUrl: './chofer-form.component.html',
  styleUrls: ['./chofer-form.component.scss'],
})
export class ChoferFormComponent implements OnInit, OnDestroy {
  a = PermisoAccionEnum;
  id?: number;
  estado = EstadoEnum.PENDIENTE;
  isActive = false;
  isEdit = false;
  isShow = false;
  isPanelOpen = false;
  isInfoTouched = true;
  isPropietarioTouched = false;
  isRegistroTouched = false;
  isAddressTouched = false;
  backUrl = `/flota/${m.CHOFER}/${a.LISTAR}`;
  modelo = m.CHOFER;
  propietarioModelo = m.PROPIETARIO;
  gestorCuentaId?: number;
  fotoDocumentoFrente: string | null = null;
  fotoDocumentoFrenteFile: File | null = null;
  fotoDocumentoReverso: string | null = null;
  fotoDocumentoReversoFile: File | null = null;
  fotoPerfil: string | null = null;
  fotoPerfilFile: File | null = null;
  fotoDocumentoFrentePropietario: string | null = null;
  fotoDocumentoFrentePropietarioFile: File | null = null;
  fotoDocumentoReversoPropietario: string | null = null;
  fotoDocumentoReversoPropietarioFile: File | null = null;
  fotoRegistroFrente: string | null = null;
  fotoRegistroFrenteFile: File | null = null;
  fotoRegistroReverso: string | null = null;
  fotoRegistroReversoFile: File | null = null;
  created_by = '';
  created_at = '';
  modified_by = '';
  modified_at = '';

  form = this.fb.group({
    info: this.fb.group({
      nombre: [null, Validators.required],
      tipo_documento_id: [null, Validators.required],
      pais_emisor_documento_id: [null, Validators.required],
      numero_documento: [null, Validators.required],
      ruc: [null, Validators.required],
      digito_verificador: [null, Validators.min(0)],
      fecha_nacimiento: [null, DateValidator.date],
      oficial_cuenta_id: [null, Validators.required],
      alias: null,
      foto_documento_frente: null,
      foto_documento_reverso: null,
      foto_perfil: null,
      es_propietario: null,
      telefono: [
        null,
        [Validators.required, Validators.pattern('^([+]595|0)([0-9]{9})$')],
      ],
      email: [null, emailValidator],
    }),
    propietario: this.fb.group({
      pais_origen_id: null,
      foto_documento_frente_propietario: null,
      foto_documento_reverso_propietario: null,
    }),
    registro: this.fb.group({
      pais_emisor_registro_id: [null, Validators.required],
      localidad_emisor_registro_id: [null, Validators.required],
      ciudad_emisor_registro_id: [null, Validators.required],
      tipo_registro_id: null,
      numero_registro: [null, Validators.required],
      vencimiento_registro: [null, Validators.required],
      foto_registro_frente: null,
      foto_registro_reverso: null,
    }),
    address: this.fb.group({
      pais_id: null,
      localidad_id: null,
      ciudad_id: null,
      direccion: [null, Validators.required],
    }),
  });

  initialFormValue = this.form.value;
  hasChange = false;
  hasChangeSubscription = this.form.valueChanges.subscribe((value) => {
    setTimeout(() => {
      this.hasChange = !isEqual(this.initialFormValue, value);
    });
  });

  esPropietarioSubscription = this.esPropietarioControl.valueChanges.subscribe(
    (esPropietario) => {
      if (esPropietario) {
        this.propietario
          .get('pais_origen_id')!
          .setValidators(Validators.required);
      } else {
        this.propietario.get('pais_origen_id')!.clearAsyncValidators();
      }
      this.propietario.get('pais_origen_id')!.updateValueAndValidity();
    }
  );

  get puedeModificarSoloAliasYcontactos(): boolean {
    if (this.isShow || !this.isEdit) {
      return false;
    }
    return !this.userService.checkPermisoAndGestorCargaId(
      a.EDITAR,
      this.modelo,
      this.gestorCuentaId
    );
  }

  get info(): FormGroup {
    return this.form.get('info') as FormGroup;
  }

  get propietario(): FormGroup {
    return this.form.get('propietario') as FormGroup;
  }

  get registro(): FormGroup {
    return this.form.get('registro') as FormGroup;
  }

  get address(): FormGroup {
    return this.form.get('address') as FormGroup;
  }

  get esPropietarioControl(): FormControl {
    return this.info.get('es_propietario') as FormControl;
  }

  get esPropietario(): boolean {
    return !!this.esPropietarioControl.value;
  }

  constructor(
    private fb: FormBuilder,
    private choferService: ChoferService,
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
    this.esPropietarioSubscription.unsubscribe();
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
      '¿Está seguro que desea activar al Chofer?',
      this.choferService.active(this.id!),
      () => {
        this.getData();
      }
    );
  }

  inactive(): void {
    this.dialog.changeStatusConfirm(
      '¿Está seguro que desea desactivar al Chofer?',
      this.choferService.inactive(this.id!),
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
          ...this.address.value,
          ...this.propietario.value,
          ...this.registro.value,
        })
      );
      delete data.logo;
      formData.append('data', JSON.stringify(data));
      if (this.fotoDocumentoFrenteFile) {
        formData.append(
          'foto_documento_frente_file',
          this.fotoDocumentoFrenteFile
        );
      }
      if (this.fotoDocumentoReversoFile) {
        formData.append(
          'foto_documento_reverso_file',
          this.fotoDocumentoReversoFile
        );
      }
      if (this.fotoPerfilFile) {
        formData.append('foto_perfil_file', this.fotoPerfilFile);
      }
      if (this.fotoDocumentoFrentePropietarioFile) {
        formData.append(
          'foto_documento_frente_propietario_file',
          this.fotoDocumentoFrentePropietarioFile
        );
      }
      if (this.fotoDocumentoReversoPropietarioFile) {
        formData.append(
          'foto_documento_reverso_propietario_file',
          this.fotoDocumentoReversoPropietarioFile
        );
      }
      if (this.fotoRegistroFrenteFile) {
        formData.append(
          'foto_registro_frente_file',
          this.fotoRegistroFrenteFile
        );
      }
      if (this.fotoRegistroReversoFile) {
        formData.append(
          'foto_registro_reverso_file',
          this.fotoRegistroReversoFile
        );
      }
      this.hasChange = false;
      this.initialFormValue = this.form.value;
      if (this.isEdit && this.id) {
        this.choferService.edit(this.id, formData).subscribe(() => {
          this.snackbar.openUpdateAndRedirect(confirmed, this.backUrl);
          this.getData();
        });
      } else {
        this.choferService.create(formData).subscribe((chofer) => {
          this.snackbar.openSaveAndRedirect(confirmed, this.backUrl, [
            `/flota/${m.CHOFER}/${a.EDITAR}`,
            chofer.id,
          ]);
        });
      }
    } else {
      setTimeout(() => {
        this.isInfoTouched = this.info.invalid;
        this.isPropietarioTouched = this.propietario.invalid;
        this.isRegistroTouched = this.registro.invalid;
        this.isAddressTouched = this.address.invalid;
      });
    }
  }

  private getData(): void {
    this.id = +this.route.snapshot.params.id;
    if (this.id) {
      this.isEdit = /edit/.test(this.router.url);
      this.isShow = /ver/.test(this.router.url);
      if (this.isShow) {
        this.form.disable();
      }
      this.choferService.getById(this.id).subscribe((data) => {
        this.estado = data.estado;
        this.isActive = data.estado === EstadoEnum.ACTIVO;
        this.gestorCuentaId = data.gestor_cuenta_id;
        this.fotoDocumentoFrente = data.foto_documento_frente!;
        this.fotoDocumentoReverso = data.foto_documento_reverso!;
        this.fotoPerfil = data.foto_perfil!;
        this.fotoDocumentoFrentePropietario =
          data.foto_documento_frente_propietario ?? null;
        this.fotoDocumentoReversoPropietario =
          data.foto_documento_reverso_propietario ?? null;
        this.fotoRegistroFrente = data.foto_registro_frente ?? null;
        this.fotoRegistroReverso = data.foto_registro_reverso ?? null;
        this.created_by = data.created_by;
        this.created_at = data.created_at;
        this.modified_by = data.modified_by;
        this.modified_at = data.modified_at;
        if (this.puedeModificarSoloAliasYcontactos) {
          this.info.disable();
          this.address.disable();
          this.propietario.disable();
          this.registro.disable();
          this.info.controls['alias'].enable();
        }
        this.form.setValue({
          info: {
            alias: data.gestor_carga_chofer?.alias ?? data.nombre,
            nombre: data.nombre,
            tipo_documento_id: data.tipo_documento_id,
            pais_emisor_documento_id: data.pais_emisor_documento_id,
            numero_documento: data.numero_documento,
            ruc: data.ruc,
            digito_verificador: data.digito_verificador,
            fecha_nacimiento: data.fecha_nacimiento,
            oficial_cuenta_id: data.oficial_cuenta_id,
            telefono: data.telefono,
            email: data.email,
            es_propietario: data.es_propietario,
            foto_documento_frente: null,
            foto_documento_reverso: null,
            foto_perfil: null,
          },
          propietario: {
            pais_origen_id: data.pais_origen_id ?? null,
            foto_documento_frente_propietario: null,
            foto_documento_reverso_propietario: null,
          },
          registro: {
            pais_emisor_registro_id: data.pais_emisor_documento_id,
            localidad_emisor_registro_id: data.localidad_emisor_registro_id,
            ciudad_emisor_registro_id: data.ciudad_emisor_registro_id,
            tipo_registro_id: data.tipo_registro_id,
            numero_registro: data.numero_registro,
            vencimiento_registro: data.vencimiento_registro,
            foto_registro_frente: null,
            foto_registro_reverso: null,
          },
          address: {
            pais_id: data.ciudad?.localidad.pais_id ?? null,
            localidad_id: data.ciudad?.localidad_id ?? null,
            ciudad_id: data.ciudad_id,
            direccion: data.direccion,
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
