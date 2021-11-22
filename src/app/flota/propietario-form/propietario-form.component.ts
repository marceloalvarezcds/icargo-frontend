import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash';
import { PermisoAccionEnum as a, PermisoAccionEnum, PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { PropietarioContactoGestorCargaList } from 'src/app/interfaces/propietario-contacto-gestor-carga';
import { User } from 'src/app/interfaces/user';
import { PropietarioService } from 'src/app/services/propietario.service';
import { UserService } from 'src/app/services/user.service';
import { openSnackbar } from 'src/app/utils/snackbar';
import { DateValidator } from 'src/app/validators/date-validator';
import { PropietarioFormInfoComponent } from '../propietario-form-info/propietario-form-info.component';

@Component({
  selector: 'app-propietario-form',
  templateUrl: './propietario-form.component.html',
  styleUrls: ['./propietario-form.component.scss']
})
export class PropietarioFormComponent implements OnInit, OnDestroy {

  a = PermisoAccionEnum;
  id?: number;
  isEdit = false;
  isShow = false;
  isPanelOpen = false;
  isInfoTouched = true;
  isContactoTouched = false;
  isAddressTouched = false;
  backUrl = `/flota/${m.PROPIETARIO}/${a.LISTAR}`;
  user?: User;
  userSubscription = this.userService.getLoggedUser().subscribe((user) => {
    this.user = user;
  });
  modelo = m.PROPIETARIO;
  gestorCuentaId?: number;

  contactoList: PropietarioContactoGestorCargaList[] = [];

  fotoDocumento: string | null = null;
  fotoPerfil: string | null = null;

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
      foto_documento: [null, Validators.required],
      foto_perfil: [null, Validators.required],
      es_chofer: null,
      telefono: [null, [Validators.required, Validators.pattern(/^([+]595|0)([0-9]{9})$/g)]],
      email: [null, Validators.email],
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
  hasChangeSubscription = this.form.valueChanges.subscribe(value => {
    setTimeout(() => {
      this.hasChange = !isEqual(this.initialFormValue, value);
    });
  });

  get puedeModificarSoloAliasYcontactos(): boolean {
    if (this.isShow || !this.isEdit) { return false; }
    return !this.userService.checkPermisoAndGestorCargaId(a.EDITAR, this.modelo, this.gestorCuentaId);
  }

  get info(): FormGroup {
    return this.form.get('info') as FormGroup;
  }

  get contactos(): FormArray {
    return this.form.get('contactos') as FormArray;
  }

  get address(): FormGroup {
    return this.form.get('address') as FormGroup;
  }

  get fotoDocumentoFile(): File | null {
    return this.formInfo!.fotoDocumentoFile;
  }

  get fotoDocumentoControl(): FormControl {
    return this.info.get('foto_documento') as FormControl;
  }

  get fotoPerfilFile(): File | null {
    return this.formInfo!.fotoPerfilFile;
  }

  get fotoPerfilControl(): FormControl {
    return this.info.get('foto_perfil') as FormControl;
  }

  @ViewChild(PropietarioFormInfoComponent) formInfo?: PropietarioFormInfoComponent;

  constructor(
    private fb: FormBuilder,
    private propietarioService: PropietarioService,
    private userService: UserService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    this.hasChangeSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
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

  submit(confirmed: boolean): void {
    this.isInfoTouched = false;
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const formData = new FormData();
      const data = JSON.parse(JSON.stringify({
        ...this.info.value,
        ...this.address.value,
        contactos: this.contactos.value,
      }));
      delete data.logo;
      delete data.pais_id;
      delete data.localidad_id;
      formData.append('data', JSON.stringify(data));
      if (this.fotoDocumentoFile) { formData.append('foto_documento_file', this.fotoDocumentoFile); }
      if (this.fotoPerfilFile) { formData.append('foto_perfil_file', this.fotoPerfilFile); }
      if (this.isEdit && this.id) {
        this.propietarioService.edit(this.id, formData).subscribe(() => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
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
                this.router.navigate([`/flota/${m.PROPIETARIO}/${a.EDITAR}`, propietario.id]);
              }
            });
        });
      }
    } else {
      setTimeout(() => {
        this.isInfoTouched = this.info.invalid;
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
      if (this.isEdit) {
        this.fotoDocumentoControl.removeValidators(Validators.required);
        this.fotoPerfilControl.removeValidators(Validators.required);
      }
      if (this.isShow) {
        this.form.disable();
      }
      this.propietarioService.getById(this.id).subscribe(data => {
        this.gestorCuentaId = data.gestor_cuenta_id;
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
            foto_documento: null,
            foto_perfil: null,
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
        this.fotoDocumento = data.foto_documento!;
        this.fotoPerfil = data.foto_perfil!;
        if (this.puedeModificarSoloAliasYcontactos) {
          this.info.disable();
          this.address.disable();
          this.info.controls['alias'].enable();
        }
        setTimeout(() => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
        }, 500);
      });
    }
  }
}
