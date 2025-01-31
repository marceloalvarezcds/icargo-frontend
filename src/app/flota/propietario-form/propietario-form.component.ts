import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
import { Ciudad } from 'src/app/interfaces/ciudad';
import { PropietarioContactoGestorCargaList } from 'src/app/interfaces/propietario-contacto-gestor-carga';
import { DialogService } from 'src/app/services/dialog.service';
import { PropietarioService } from 'src/app/services/propietario.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { DateValidator } from 'src/app/validators/date-validator';
import { emailValidator } from 'src/app/validators/email-validator';

@Component({
  selector: 'app-propietario-form',
  templateUrl: './propietario-form.component.html',
  styleUrls: ['./propietario-form.component.scss'],
})
export class PropietarioFormComponent implements OnInit, OnDestroy {
  a = PermisoAccionEnum;
  anticiposBloqueados = false;
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
  ciudadSelected?: Ciudad;
  gestorCuentaId?: number;
  cantidadOCConAnticiposLiberados = 0;
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
  isDialog: boolean = false;

  form = this.fb.group({
    info: this.fb.group({
      nombre: [null, Validators.required],
      // tipo_persona_id: [null, Validators.required],
      composicion_juridica_id: [null, Validators.required],
      ruc: [null, Validators.required],
      // digito_verificador: [null, Validators.min(0)],
      pais_origen_id: null,
      fecha_nacimiento: [null, DateValidator.date],
      oficial_cuenta_id: null,
      alias: null,
      foto_documento_frente: null,
      foto_documento_reverso: null,
      foto_perfil: null,
      es_chofer: null,
      puede_recibir_anticipos: true,
      telefono: [null, Validators.pattern('^([+]595|0)([0-9]{9})$')],
      email: [null, emailValidator],
      nombre_corto: null,
      tipo_documento_propietario_id: [null, Validators.required],
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
      ciudad_id: null,
      direccion: null,
    }),
  });

  initialFormValue = this.form.value;
  hasChange = false;
  hasChangeSubscription = this.form.valueChanges.subscribe((value) => {
    setTimeout(() => {
      this.hasChange = !isEqual(this.initialFormValue, value);
    });
  });

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

  get tipoDocumentoIdControl(): FormGroup {
    return this.chofer.get('tipo_documento_id') as FormGroup;
  }

  get paisEmisorDocumentoIdControl(): FormGroup {
    return this.chofer.get('pais_emisor_documento_id') as FormGroup;
  }

  get numeroDocumentoControl(): FormGroup {
    return this.chofer.get('numero_documento') as FormGroup;
  }

  constructor(
    private fb: FormBuilder,
    private propietarioService: PropietarioService,
    private userService: UserService,
    private snackbar: SnackbarService,
    private dialog: DialogService,
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<PropietarioFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private data?: any
  ) {

    if (this.data && this.data.isDialog) {
      this.isDialog = this.data.isDialog;
      this.isShow = this.data.readOnly;
    }

  }

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
      '¿Está seguro que desea activar al Propietario?',
      this.propietarioService.active(this.id!),
      () => {
        this.getData();
      }
    );
  }

  inactive(): void {
    this.dialog.changeStatusConfirm(
      '¿Está seguro que desea desactivar al Propietario?',
      this.propietarioService.inactive(this.id!),
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
          anticipos_bloqueados: this.anticiposBloqueados,
          contactos: this.contactos.value,
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
      this.hasChange = false;
      this.initialFormValue = this.form.value;
      if (this.isEdit && this.id) {
        this.propietarioService.edit(this.id, formData).subscribe(() => {
          this.snackbar.openUpdateAndRedirect(confirmed, this.backUrl);
          this.getData();
        });
      } else {
        this.propietarioService.create(formData).subscribe((propietario) => {

          if (this.isDialog){

            this.dialogRef.close(propietario);

          } else {
            this.snackbar.openSaveAndRedirect(
              confirmed,
              this.backUrl,
              r.FLOTA,
              m.PROPIETARIO,
              propietario.id
            );
          }

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

  bloquearAnticipos(): void {
    this.dialog.confirmation(
      'Existen Órdenes de Carga Aceptadas y con Anticipos liberados ¿Desea bloquearlos después de guardar los cambios?',
      () => {
        this.anticiposBloqueados = true;
      }
    );
  }

  esChoferChange(esChofer: boolean): void {
    if (esChofer) {
      this.tipoDocumentoIdControl.setValidators(Validators.required);
      this.paisEmisorDocumentoIdControl.setValidators(Validators.required);
      this.numeroDocumentoControl.setValidators(Validators.required);
    } else {
      this.tipoDocumentoIdControl.removeValidators(Validators.required);
      this.paisEmisorDocumentoIdControl.removeValidators(Validators.required);
      this.numeroDocumentoControl.removeValidators(Validators.required);
    }
    this.tipoDocumentoIdControl.updateValueAndValidity();
    this.paisEmisorDocumentoIdControl.updateValueAndValidity();
    this.numeroDocumentoControl.updateValueAndValidity();
  }

  private getData(): void {
    this.id = +this.route.snapshot.params.id;
    if (this.isDialog) {
      this.id = this.data.id;
    }
    if (this.id) {
      if (!this.isDialog) {
        this.isEdit = /edit/.test(this.router.url);
        this.isShow = /ver/.test(this.router.url);
      }
      if (this.isShow) {
        this.form.disable();
      }
      this.propietarioService.getById(this.id).subscribe((data) => {
        this.ciudadSelected = data.ciudad;
        this.estado = data.estado;
        this.cantidadOCConAnticiposLiberados = data.oc_with_anticipos_liberados;
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
        this.form.patchValue({
          info: {
            alias: data.gestor_carga_propietario?.alias ?? null,
            nombre: data.nombre,
            // tipo_persona_id: data.tipo_persona_id,
            ruc: data.ruc,
            tipo_documento_propietario_id: data.tipo_documento_propietario_id ?? null,
            composicion_juridica_id: data.composicion_juridica_id,
            pais_origen_id: data.pais_origen_id,
            fecha_nacimiento: data.fecha_nacimiento,
            oficial_cuenta_id: data.oficial_cuenta_id,
            telefono: data.telefono,
            email: data.email,
            es_chofer: data.es_chofer,
            puede_recibir_anticipos: data.puede_recibir_anticipos,
            foto_documento_frente: data.foto_documento_frente,
            foto_documento_reverso: data.foto_documento_reverso,
            foto_perfil: data.foto_perfil,

          },
          chofer: {
            tipo_documento_id: data.tipo_documento_id ?? null,
            pais_emisor_documento_id: data.pais_emisor_documento_id ?? null,
            numero_documento: data.numero_documento ?? null,
            foto_documento_frente_chofer: data.foto_documento_frente_chofer,
            foto_documento_reverso_chofer: data.foto_documento_reverso_chofer,
          },
          registro: {
            pais_emisor_registro_id: data.pais_emisor_documento_id ?? null,
            localidad_emisor_registro_id:
              data.localidad_emisor_registro_id ?? null,
            ciudad_emisor_registro_id: data.ciudad_emisor_registro_id ?? null,
            tipo_registro_id: data.tipo_registro_id ?? null,
            numero_registro: data.numero_registro ?? null,
            vencimiento_registro: data.vencimiento_registro ?? null,
            foto_registro_frente: data.foto_registro_frente,
            foto_registro_reverso: data.foto_registro_reverso,
          },
          address: {
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
