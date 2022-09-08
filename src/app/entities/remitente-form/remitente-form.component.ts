import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash';
import {
  PermisoAccionEnum as a,
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Ciudad } from 'src/app/interfaces/ciudad';
import { RemitenteContactoGestorCargaList } from 'src/app/interfaces/remitente-contacto-gestor-carga';
import { User } from 'src/app/interfaces/user';
import { RemitenteService } from 'src/app/services/remitente.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { PageFormEntitiesInfoComponent } from 'src/app/shared/page-form-entities-info/page-form-entities-info.component';
import { emailValidator } from 'src/app/validators/email-validator';

@Component({
  selector: 'app-remitente-form',
  templateUrl: './remitente-form.component.html',
  styleUrls: ['./remitente-form.component.scss'],
})
export class RemitenteFormComponent implements OnInit, OnDestroy {
  a = PermisoAccionEnum;
  id?: number;
  isEdit = false;
  isShow = false;
  isPanelOpen = false;
  isInfoTouched = true;
  isContactoTouched = false;
  isGeoTouched = false;
  backUrl = `/entities/${m.REMITENTE}/${a.LISTAR}`;
  user?: User;
  userSubscription = this.userService.getLoggedUser().subscribe((user) => {
    this.user = user;
  });
  modelo = m.REMITENTE;
  ciudadSelected?: Ciudad | null;

  contactoList: RemitenteContactoGestorCargaList[] = [];

  logo: string | null = null;

  form = this.fb.group({
    info: this.fb.group({
      nombre: [null, Validators.required],
      nombre_corto: null,
      tipo_documento_id: [null, Validators.required],
      numero_documento: [null, Validators.required],
      digito_verificador: [null, Validators.min(0)],
      composicion_juridica_id: null,
      alias: null,
      logo: null,
      telefono: [null, Validators.pattern('^([+]595|0)([0-9]{9})$')],
      email: [null, emailValidator],
      pagina_web: null,
      info_complementaria: null,
    }),
    contactos: this.fb.array([]),
    geo: this.fb.group({
      ciudad_id: null,
      latitud: null,
      longitud: null,
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

  get info(): FormGroup {
    return this.form.get('info') as FormGroup;
  }

  get contactos(): FormArray {
    return this.form.get('contactos') as FormArray;
  }

  get geo(): FormGroup {
    return this.form.get('geo') as FormGroup;
  }

  get file(): File | null {
    return this.pageInfo!.file;
  }

  get fileControl(): FormControl {
    return this.info.get('logo') as FormControl;
  }

  @ViewChild(PageFormEntitiesInfoComponent)
  pageInfo?: PageFormEntitiesInfoComponent;

  constructor(
    private fb: FormBuilder,
    private remitenteService: RemitenteService,
    private userService: UserService,
    private snackbar: SnackbarService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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
    this.router.navigate([`/entities/${m.REMITENTE}/${a.EDITAR}`, this.id]);
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
          ...this.geo.value,
          contactos: this.contactos.value,
        })
      );
      delete data.logo;
      delete data.pais_id;
      delete data.localidad_id;
      formData.append('data', JSON.stringify(data));
      if (this.file) {
        formData.append('file', this.file);
      }
      this.hasChange = false;
      this.initialFormValue = this.form.value;
      if (this.isEdit && this.id) {
        this.remitenteService.edit(this.id, formData).subscribe(() => {
          this.snackbar.openUpdateAndRedirect(confirmed, this.backUrl);
          this.getData();
        });
      } else {
        this.remitenteService.create(formData).subscribe((remitente) => {
          this.snackbar.openSaveAndRedirect(confirmed, this.backUrl, [
            `/entities/${m.REMITENTE}/${a.EDITAR}`,
            remitente.id,
          ]);
        });
      }
    } else {
      setTimeout(() => {
        this.isInfoTouched = this.info.invalid;
        this.isContactoTouched = this.contactos.invalid;
        this.isGeoTouched = this.geo.invalid;
      });
    }
  }

  private getData(): void {
    this.id = +this.route.snapshot.params.id;
    if (this.id) {
      this.isEdit = /edit/.test(this.router.url);
      this.isShow = /ver/.test(this.router.url);
      if (this.isEdit) {
        this.fileControl.removeValidators(Validators.required);
      }
      if (this.isShow) {
        this.form.disable();
      }
      this.remitenteService.getById(this.id).subscribe((data) => {
        this.ciudadSelected = data.ciudad;
        this.form.patchValue({
          info: {
            alias: data.gestor_carga_remitente?.alias ?? data.nombre_corto,
            nombre: data.nombre,
            nombre_corto: data.nombre_corto,
            tipo_documento_id: data.tipo_documento_id,
            numero_documento: data.numero_documento,
            digito_verificador: data.digito_verificador,
            composicion_juridica_id: data.composicion_juridica_id,
            telefono: data.telefono,
            email: data.email,
            pagina_web: data.pagina_web,
            info_complementaria: data.info_complementaria,
            logo: null,
          },
          geo: {
            ciudad_id: data.ciudad_id,
            latitud: data.latitud,
            longitud: data.longitud,
            direccion: data.direccion,
          },
        });
        this.contactoList = data.contactos.slice();
        this.logo = data.logo!;
        setTimeout(() => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
        }, 500);
      });
    }
  }
}
