import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CentroOperativoContactoGestorCargaList } from 'src/app/interfaces/centro-operativo-contacto-gestor-carga';
import { FileChangeEvent } from 'src/app/interfaces/file-change-event';
import { User } from 'src/app/interfaces/user';
import { CentroOperativoClasificacionService } from 'src/app/services/centro-operativo-clasificacion.service';
import { CentroOperativoService } from 'src/app/services/centro-operativo.service';
import { UserService } from 'src/app/services/user.service';
import { openSnackbar } from 'src/app/utils/snackbar';

@Component({
  selector: 'app-centros-operativos-form',
  templateUrl: './centros-operativos-form.component.html',
  styleUrls: ['./centros-operativos-form.component.scss']
})
export class CentrosOperativosFormComponent implements OnInit, OnDestroy {

  id?: number;
  isEdit = false;
  isShow = false;
  isPanelOpen = false;
  isInfoTouched = false;
  isGeoTouched = false;
  backUrl = '/entities/centros-operativos/list';
  centroOperativoClasificacionList$ = this.centroOperativoClasificacionService.getList();
  user?: User;
  userSubscription = this.userService.getLoggedUser().subscribe((user) => {
    this.user = user;
  });

  contactoList: CentroOperativoContactoGestorCargaList[] = [];

  file: File | null = null;
  logo: string | null = null;

  form = this.fb.group({
    info: this.fb.group({
      nombre: [null, Validators.required],
      nombre_corto: [null, Validators.required],
      clasificacion_id: [null, Validators.required],
      alias: null,
      logo: [null, Validators.required],
      telefono: [null, [Validators.required, Validators.pattern(/^([+]595|0)([0-9]{9})$/g)]],
      email: null,
      pagina_web: null,
    }),
    contactos: this.fb.array([]),
    geo: this.fb.group({
      pais_id: [null, Validators.required],
      localidad_id: [null, Validators.required],
      ciudad_id: [null, Validators.required],
      latitud: [null, Validators.required],
      longitud: [null, Validators.required],
      direccion: [null, Validators.required],
    }),
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

  get fileControl(): FormControl {
    return this.info.get('logo') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private centroOperativoClasificacionService:  CentroOperativoClasificacionService,
    private centroOperativoService:  CentroOperativoService,
    private userService: UserService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  back(confirmed: boolean): void {
    if (confirmed) {
      this.submit(confirmed);
    } else {
      this.router.navigate([this.backUrl]);
    }
  }

  fileChange(fileEvent: FileChangeEvent): void {
    this.logo = null;
    this.file = fileEvent.target!.files!.item(0);
    this.fileControl.setValue(this.file?.name);
  }

  submit(confirmed: boolean): void {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const formData = new FormData();
      const data = JSON.parse(JSON.stringify({
        ...this.info.value,
        ...this.geo.value,
        contactos: this.contactos.value,
      }));
      delete data.logo;
      delete data.pais_id;
      delete data.localidad_id;
      formData.append('data', JSON.stringify(data));
      if (this.file) { formData.append('file', this.file); }
      if (this.isEdit && this.id) {
        this.centroOperativoService.edit(this.id, formData).subscribe(() => {
          openSnackbar(this.snackbar, confirmed, this.router, this.backUrl);
        });
      } else {
        this.centroOperativoService.create(formData).subscribe((centroOperativo) => {
          this.snackbar
            .open('Datos guardados satisfactoriamente', 'Ok')
            .afterDismissed()
            .subscribe(() => {
              if (confirmed) {
                this.router.navigate([this.backUrl]);
              } else {
                this.router.navigate(['/entities/centros-operativos/edit', centroOperativo.id]);
              }
            });
        });
      }
    } else {
      this.isInfoTouched = this.info.invalid;
      this.isGeoTouched = this.geo.invalid;
    }
  }

  private getData(): void {
    this.id = +this.route.snapshot.params.id;
    if (this.id) {
      this.isEdit = /edit/.test(this.router.url);
      this.isShow = /show/.test(this.router.url);
      if (this.isEdit) {
        this.fileControl.removeValidators(Validators.required);
      }
      if (this.isShow) {
        this.form.disable();
      }
      this.centroOperativoService.getById(this.id).subscribe(data => {
        this.form.setValue({
          info: {
            alias: data.gestor_carga_centro_operativo?.alias ?? data.nombre_corto,
            nombre: data.nombre,
            nombre_corto: data.nombre_corto,
            clasificacion_id: data.clasificacion_id,
            telefono: data.telefono,
            email: data.email,
            pagina_web: data.pagina_web,
            logo: null,
          },
          geo: {
            pais_id: data.ciudad.localidad.pais_id,
            localidad_id: data.ciudad.localidad_id,
            ciudad_id: data.ciudad_id,
            latitud: data.latitud,
            longitud: data.longitud,
            direccion: data.direccion,
          },
          contactos: [],
        });
        this.contactoList = data.contactos.slice();
        this.logo = data.logo!;
      });
    }
  }
}
