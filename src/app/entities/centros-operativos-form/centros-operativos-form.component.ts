import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash';
import {
  PermisoAccionEnum as a,
  PermisoAccionEnum,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as r,
} from 'src/app/enums/permiso-enum';
import { CentroOperativoContactoGestorCargaList } from 'src/app/interfaces/centro-operativo-contacto-gestor-carga';
import { Ciudad } from 'src/app/interfaces/ciudad';
import { User } from 'src/app/interfaces/user';
import { CentroOperativoClasificacionService } from 'src/app/services/centro-operativo-clasificacion.service';
import { CentroOperativoService } from 'src/app/services/centro-operativo.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { emailValidator } from 'src/app/validators/email-validator';

@Component({
  selector: 'app-centros-operativos-form',
  templateUrl: './centros-operativos-form.component.html',
  styleUrls: ['./centros-operativos-form.component.scss'],
})
export class CentrosOperativosFormComponent implements OnInit, OnDestroy {
  a = PermisoAccionEnum;
  id?: number;
  isEdit = false;
  isShow = false;
  isPanelOpen = false;
  isInfoTouched = true;
  isContactoTouched = false;
  isGeoTouched = false;
  backUrl = `/entities/${m.CENTRO_OPERATIVO}/${a.LISTAR}`;
  centroOperativoClasificacionList$ =
    this.centroOperativoClasificacionService.getList();
  user?: User;
  userSubscription = this.userService.getLoggedUser().subscribe((user) => {
    this.user = user;
  });
  modelo = m.CENTRO_OPERATIVO;
  ciudadSelected?: Ciudad | null;

  contactoList: CentroOperativoContactoGestorCargaList[] = [];

  file: File | null = null;
  logo: string | null = null;

  form = this.fb.group({
    info: this.fb.group({
      nombre: [null, Validators.required],
      nombre_corto: null,
      clasificacion_id: [null, Validators.required],
      alias: null,
      logo: null,
      telefono: [null, Validators.pattern('^([+]595|0)([0-9]{9})$')],
      email: [null, emailValidator],
      pagina_web: null,
    }),
    contactos: this.fb.array([]),
    geo: this.fb.group({
      ciudad_id: [null, Validators.required],
      latitud: [null, Validators.required],
      longitud: [null, Validators.required],
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

  constructor(
    private fb: FormBuilder,
    private centroOperativoClasificacionService: CentroOperativoClasificacionService,
    private centroOperativoService: CentroOperativoService,
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
    this.router.navigate([
      `/entities/${m.CENTRO_OPERATIVO}/${a.EDITAR}`,
      this.id,
    ]);
  }

  fileChange(file: File | null): void {
    this.logo = null;
    this.file = file;
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
      // Convertir propiedades a mayúsculas, excepto los correos electrónicos
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string' && key !== 'email') {
          data[key] = data[key].toUpperCase();
        }
      });  
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
        this.centroOperativoService.edit(this.id, formData).subscribe(() => {
          this.snackbar.openUpdateAndRedirect(confirmed, this.backUrl);
          this.getData();
        });
      } else {
        this.centroOperativoService
          .create(formData)
          .subscribe((centroOperativo) => {
            this.snackbar.openSaveAndRedirect(
              confirmed,
              this.backUrl,
              r.ENTITIES,
              m.CENTRO_OPERATIVO,
              centroOperativo.id
            );
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
      if (this.isShow) {
        this.form.disable();
      }
      this.centroOperativoService.getById(this.id).subscribe((data) => {
        this.ciudadSelected = data.ciudad;
        this.form.patchValue({
          info: {
            alias:
              data.gestor_carga_centro_operativo?.alias ?? data.nombre_corto,
            nombre: data.nombre,
            nombre_corto: data.nombre_corto,
            clasificacion_id: data.clasificacion_id,
            telefono: data.telefono,
            email: data.email,
            pagina_web: data.pagina_web,
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
