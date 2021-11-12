import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash';
import { RemitenteContactoGestorCargaList } from 'src/app/interfaces/remitente-contacto-gestor-carga';
import { User } from 'src/app/interfaces/user';
import { RemitenteService } from 'src/app/services/remitente.service';
import { UserService } from 'src/app/services/user.service';
import { openSnackbar } from 'src/app/utils/snackbar';
import { PageFormEntitiesInfoComponent } from 'src/app/shared/page-form-entities-info/page-form-entities-info.component';

@Component({
  selector: 'app-remitente-form',
  templateUrl: './remitente-form.component.html',
  styleUrls: ['./remitente-form.component.scss']
})
export class RemitenteFormComponent implements OnInit, OnDestroy {

  id?: number;
  isEdit = false;
  isShow = false;
  isPanelOpen = false;
  isInfoTouched = true;
  isContactoTouched = false;
  isGeoTouched = false;
  backUrl = '/entities/remitente/list';
  user?: User;
  userSubscription = this.userService.getLoggedUser().subscribe((user) => {
    this.user = user;
  });

  contactoList: RemitenteContactoGestorCargaList[] = [];

  logo: string | null = null;

  form = this.fb.group({
    info: this.fb.group({
      nombre: [null, Validators.required],
      nombre_corto: [null, Validators.required],
      tipo_documento_id: [null, Validators.required],
      numero_documento: [null, Validators.required],
      digito_verificador: [null, Validators.min(0)],
      composicion_juridica_id: [null, Validators.required],
      alias: null,
      logo: [null, Validators.required],
      telefono: [null, [Validators.required, Validators.pattern(/^([+]595|0)([0-9]{9})$/g)]],
      email: null,
      pagina_web: null,
      info_complementaria: null,
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

  initialFormValue = this.form.value;
  hasChange = false;
  hasChangeSubscription = this.form.valueChanges.subscribe(value => {
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

  @ViewChild(PageFormEntitiesInfoComponent) pageInfo?: PageFormEntitiesInfoComponent;

  constructor(
    private fb: FormBuilder,
    private remitenteService: RemitenteService,
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
    this.router.navigate(['/entities/remitente/edit', this.id]);
  }

  submit(confirmed: boolean): void {
    this.isInfoTouched = false;
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
        this.remitenteService.edit(this.id, formData).subscribe(() => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
          openSnackbar(this.snackbar, confirmed, this.router, this.backUrl);
        });
      } else {
        this.remitenteService.create(formData).subscribe((remitente) => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
          this.snackbar
            .open('Datos guardados satisfactoriamente', 'Ok')
            .afterDismissed()
            .subscribe(() => {
              if (confirmed) {
                this.router.navigate([this.backUrl]);
              } else {
                this.router.navigate(['/entities/remitente/edit', remitente.id]);
              }
            });
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
      this.isShow = /show/.test(this.router.url);
      if (this.isEdit) {
        this.fileControl.removeValidators(Validators.required);
      }
      if (this.isShow) {
        this.form.disable();
      }
      this.remitenteService.getById(this.id).subscribe(data => {
        this.form.setValue({
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
        setTimeout(() => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
        }, 500);
      });
    }
  }
}
