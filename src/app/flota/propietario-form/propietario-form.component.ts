import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { PropietarioContactoGestorCargaList } from 'src/app/interfaces/propietario-contacto-gestor-carga';
import { PropietarioService } from 'src/app/services/propietario.service';
import { UserService } from 'src/app/services/user.service';
import {
  confirmationDialogToActive,
  confirmationDialogToInactive,
} from 'src/app/utils/change-status';
import { openSnackbar } from 'src/app/utils/snackbar';
import { DateValidator } from 'src/app/validators/date-validator';

@Component({
  selector: 'app-propietario-form',
  templateUrl: './propietario-form.component.html',
  styleUrls: ['./propietario-form.component.scss'],
})
export class PropietarioFormComponent implements OnInit, OnDestroy {
  a = PermisoAccionEnum;
  id?: number;
  estado = EstadoEnum.PENDIENTE;
  isActive = false;
  isEdit = false;
  isShow = false;
  isPanelOpen = false;
  isInfoTouched = true;
  isChoferTouched = false;
  isRegistroTouched = false;
  isContactoTouched = false;
  isAddressTouched = false;
  backUrl = `/flota/${m.PROPIETARIO}/${a.LISTAR}`;
  modelo = m.PROPIETARIO;
  camionModelo = m.CAMION;
  choferModelo = m.CHOFER;
  semirremolqueModelo = m.SEMIRREMOLQUE;
  gestorCuentaId?: number;
  contactoList: PropietarioContactoGestorCargaList[] = [];
  fotoDocumentoFrente: string | null = null;
  fotoDocumentoFrenteFile: File | null = null;
  fotoDocumentoReverso: string | null = null;
  fotoDocumentoReversoFile: File | null = null;
  fotoPerfil: string | null = null;
  fotoPerfilFile: File | null = null;
  fotoDocumentoFrenteChofer: string | null = null;
  fotoDocumentoFrenteChoferFile: File | null = null;
  fotoDocumentoReversoChofer: string | null = null;
  fotoDocumentoReversoChoferFile: File | null = null;
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
      tipo_persona_id: [null, Validators.required],
      ruc: [null, Validators.required],
      digito_verificador: [null, [Validators.required, Validators.min(0)]],
      pais_origen_id: [null, Validators.required],
      fecha_nacimiento: [null, DateValidator.date],
      oficial_cuenta_id: [null, Validators.required],
      alias: null,
      foto_documento_frente: [null, Validators.required],
      foto_documento_reverso: [null, Validators.required],
      foto_perfil: [null, Validators.required],
      es_chofer: null,
      telefono: [
        null,
        [Validators.required, Validators.pattern(/^([+]595|0)([0-9]{9})$/g)],
      ],
      email: [null, Validators.email],
    }),
    chofer: this.fb.group({
      tipo_documento_id: null,
      pais_emisor_documento_id: null,
      numero_documento: null,
      foto_documento_frente_chofer: null,
      foto_documento_reverso_chofer: null,
    }),
    registro: this.fb.group({
      pais_emisor_registro_id: null,
      localidad_emisor_registro_id: null,
      ciudad_emisor_registro_id: null,
      tipo_registro_id: null,
      numero_registro: null,
      vencimiento_registro: null,
      foto_registro_frente: null,
      foto_registro_reverso: null,
    }),
    contactos: this.fb.array([]),
    address: this.fb.group({
      pais_id: [null, Validators.required],
      localidad_id: [null, Validators.required],
      ciudad_id: [null, Validators.required],
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

  esChoferSubscription = this.esChoferControl.valueChanges.subscribe(
    (esChofer) => {
      if (esChofer) {
        this.chofer
          .get('tipo_documento_id')!
          .setValidators(Validators.required);
        this.chofer
          .get('pais_emisor_documento_id')!
          .setValidators(Validators.required);
        this.chofer.get('numero_documento')!.setValidators(Validators.required);
        this.registro
          .get('pais_emisor_registro_id')!
          .setValidators(Validators.required);
        this.registro
          .get('localidad_emisor_registro_id')!
          .setValidators(Validators.required);
        this.registro
          .get('ciudad_emisor_registro_id')!
          .setValidators(Validators.required);
        this.registro
          .get('tipo_registro_id')!
          .setValidators(Validators.required);
        this.registro
          .get('numero_registro')!
          .setValidators(Validators.required);
        this.registro
          .get('vencimiento_registro')!
          .setValidators(Validators.required);
      } else {
        this.chofer.get('tipo_documento_id')!.clearAsyncValidators();
        this.chofer.get('pais_emisor_documento_id')!.clearAsyncValidators();
        this.chofer.get('numero_documento')!.clearAsyncValidators();
        this.registro.get('pais_emisor_registro_id')!.clearAsyncValidators();
        this.registro
          .get('localidad_emisor_registro_id')!
          .clearAsyncValidators();
        this.registro.get('ciudad_emisor_registro_id')!.clearAsyncValidators();
        this.registro.get('tipo_registro_id')!.clearAsyncValidators();
        this.registro.get('numero_registro')!.clearAsyncValidators();
        this.registro.get('vencimiento_registro')!.clearAsyncValidators();
      }
      this.chofer.get('tipo_documento_id')!.updateValueAndValidity();
      this.chofer.get('pais_emisor_documento_id')!.updateValueAndValidity();
      this.chofer.get('numero_documento')!.updateValueAndValidity();
      this.registro.get('pais_emisor_registro_id')!.updateValueAndValidity();
      this.registro
        .get('localidad_emisor_registro_id')!
        .updateValueAndValidity();
      this.registro.get('ciudad_emisor_registro_id')!.updateValueAndValidity();
      this.registro.get('tipo_registro_id')!.updateValueAndValidity();
      this.registro.get('numero_registro')!.updateValueAndValidity();
      this.registro.get('vencimiento_registro')!.updateValueAndValidity();
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

  get chofer(): FormGroup {
    return this.form.get('chofer') as FormGroup;
  }

  get registro(): FormGroup {
    return this.form.get('registro') as FormGroup;
  }

  get contactos(): FormArray {
    return this.form.get('contactos') as FormArray;
  }

  get address(): FormGroup {
    return this.form.get('address') as FormGroup;
  }

  get esChoferControl(): FormControl {
    return this.info.get('es_chofer') as FormControl;
  }

  get esChofer(): boolean {
    return !!this.esChoferControl.value;
  }

  get propietarioBackUrl(): string {
    return this.router.url;
  }

  constructor(
    private fb: FormBuilder,
    private propietarioService: PropietarioService,
    private userService: UserService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    this.hasChangeSubscription.unsubscribe();
    this.esChoferSubscription.unsubscribe();
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
    confirmationDialogToActive(
      this.dialog,
      'al Propietario',
      this.propietarioService,
      this.id!,
      this.snackbar,
      () => {
        this.getData();
      }
    );
  }

  inactive(): void {
    confirmationDialogToInactive(
      this.dialog,
      'al Propietario',
      this.propietarioService,
      this.id!,
      this.snackbar,
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
          ...this.chofer.value,
          ...this.registro.value,
          contactos: this.contactos.value,
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
      if (this.fotoDocumentoFrenteChoferFile) {
        formData.append(
          'foto_documento_frente_chofer_file',
          this.fotoDocumentoFrenteChoferFile
        );
      }
      if (this.fotoDocumentoReversoChoferFile) {
        formData.append(
          'foto_documento_reverso_chofer_file',
          this.fotoDocumentoReversoChoferFile
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
      if (this.isEdit && this.id) {
        this.propietarioService.edit(this.id, formData).subscribe(() => {
          this.getData();
          openSnackbar(this.snackbar, confirmed, this.router, this.backUrl);
        });
      } else {
        this.propietarioService.create(formData).subscribe((propietario) => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
          this.snackbar
            .open('Datos guardados satisfactoriamente', 'Ok')
            .afterDismissed()
            .subscribe(() => {
              if (confirmed) {
                this.router.navigate([this.backUrl]);
              } else {
                this.router.navigate([
                  `/flota/${m.PROPIETARIO}/${a.EDITAR}`,
                  propietario.id,
                ]);
              }
            });
        });
      }
    } else {
      setTimeout(() => {
        this.isInfoTouched = this.info.invalid;
        this.isChoferTouched = this.chofer.invalid;
        this.isRegistroTouched = this.registro.invalid;
        this.isContactoTouched = this.contactos.invalid;
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
      this.propietarioService.getById(this.id).subscribe((data) => {
        this.estado = data.estado;
        this.isActive = data.estado === EstadoEnum.ACTIVO;
        this.gestorCuentaId = data.gestor_cuenta_id;
        this.fotoDocumentoFrente = data.foto_documento_frente!;
        this.fotoDocumentoReverso = data.foto_documento_reverso!;
        this.fotoPerfil = data.foto_perfil!;
        this.fotoDocumentoFrenteChofer =
          data.foto_documento_frente_chofer ?? null;
        this.fotoDocumentoReversoChofer =
          data.foto_documento_reverso_chofer ?? null;
        this.fotoRegistroFrente = data.foto_registro_frente ?? null;
        this.fotoRegistroReverso = data.foto_registro_reverso ?? null;
        this.created_by = data.created_by;
        this.created_at = data.created_at;
        this.modified_by = data.modified_by;
        this.modified_at = data.modified_at;
        if (this.puedeModificarSoloAliasYcontactos) {
          this.info.disable();
          this.address.disable();
          this.chofer.disable();
          this.registro.disable();
          this.info.controls['alias'].enable();
        }
        this.form.setValue({
          info: {
            alias: data.gestor_carga_propietario?.alias ?? data.nombre,
            nombre: data.nombre,
            tipo_persona_id: data.tipo_persona_id,
            ruc: data.ruc,
            digito_verificador: data.digito_verificador,
            pais_origen_id: data.pais_origen_id,
            fecha_nacimiento: data.fecha_nacimiento,
            oficial_cuenta_id: data.oficial_cuenta_id,
            telefono: data.telefono,
            email: data.email,
            es_chofer: data.es_chofer,
            foto_documento_frente: null,
            foto_documento_reverso: null,
            foto_perfil: null,
          },
          chofer: {
            tipo_documento_id: data.tipo_documento_id ?? null,
            pais_emisor_documento_id: data.pais_emisor_documento_id ?? null,
            numero_documento: data.numero_documento ?? null,
            foto_documento_frente_chofer: null,
            foto_documento_reverso_chofer: null,
          },
          registro: {
            pais_emisor_registro_id: data.pais_emisor_documento_id ?? null,
            localidad_emisor_registro_id:
              data.localidad_emisor_registro_id ?? null,
            ciudad_emisor_registro_id: data.ciudad_emisor_registro_id ?? null,
            tipo_registro_id: data.tipo_registro_id ?? null,
            numero_registro: data.numero_registro ?? null,
            vencimiento_registro: data.vencimiento_registro ?? null,
            foto_registro_frente: null,
            foto_registro_reverso: null,
          },
          address: {
            pais_id: data.ciudad.localidad.pais_id,
            localidad_id: data.ciudad.localidad_id,
            ciudad_id: data.ciudad_id,
            direccion: data.direccion,
          },
          contactos: [],
        });
        this.contactoList = data.contactos.slice();
        setTimeout(() => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
        }, 500);
      });
    }
  }
}
