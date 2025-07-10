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
  PermisoModuloRouterEnum as r,
} from 'src/app/enums/permiso-enum';
import { Ciudad } from 'src/app/interfaces/ciudad';
import { ProveedorContactoGestorCargaList } from 'src/app/interfaces/proveedor-contacto-gestor-carga';
import { User } from 'src/app/interfaces/user';
import { DialogService } from 'src/app/services/dialog.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { PageFormEntitiesInfoComponent } from 'src/app/shared/page-form-entities-info/page-form-entities-info.component';
import { emailValidator } from 'src/app/validators/email-validator';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { PuntoVentaListComponent } from '../punto-venta-list/punto-venta-list.component';
@Component({
  selector: 'app-proveedor-form',
  templateUrl: './proveedor-form.component.html',
  styleUrls: ['./proveedor-form.component.scss'],
})
export class ProveedorFormComponent implements OnInit, OnDestroy {
  a = PermisoAccionEnum;
  id?: number;
  isEdit = false;
  isShow = false;
  isActive = false;
  isPanelOpen = false;
  isInfoTouched = true;
  isContactoTouched = false;
  isGeoTouched = false;
  backUrl = `/entities/${m.PROVEEDOR}/${a.LISTAR}`;
  user?: User;
  userSubscription = this.userService.getLoggedUser().subscribe((user) => {
    this.user = user;
  });
  modelo = m.PROVEEDOR;
  puntoVentaModelo = m.PUNTO_VENTA;
  ciudadSelected?: Ciudad | null;

  contactoList: ProveedorContactoGestorCargaList[] = [];

  logo: string | null = null;

  form = this.fb.group({
    info: this.fb.group({
      nombre: [null, Validators.required],
      nombre_corto: null,
      estado: [true, Validators.required],
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
      localidad_nombre: [{
        value: null,
        disabled: true
      }],
      pais_nombre: [{
        value: null,
        disabled: true
      }],
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

  get puntoVentaBackUrl(): string {
    return this.router.url;
  }

  @ViewChild(PageFormEntitiesInfoComponent)
  pageInfo?: PageFormEntitiesInfoComponent;

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private userService: UserService,
    private dialog: DialogService,
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
      this.submit(confirmed, false);
    } else {
      this.router.navigate([this.backUrl]);
    }
  }

  redirectToEdit(): void {
    this.router.navigate([`/entities/${m.PROVEEDOR}/${a.EDITAR}`, this.id]);
  }

  createPuntoVenta(): void {
    if (this.id) {
      if (this.hasChange) {
        this.createPuntoVentaDialgoConfirmation();
      } else {
        this.router.navigate(
          [`/entities/${m.PUNTO_VENTA}/${a.CREAR}`, this.id],
          { queryParams: { backUrl: this.puntoVentaBackUrl } }
        );
      }
    } else {
      this.createPuntoVentaDialgoConfirmation();
    }
  }

  onEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      event.preventDefault();
    }
  }

  active(): void {
    this.dialog.changeStatusConfirm(
      '¿Está seguro que desea activar el Proveedor?',
      this.proveedorService.active(this.id!),
      () => {
        this.getData();
      }
    );
  }

  inactive(): void {
    this.dialog.changeStatusConfirm(
      '¿Está seguro que desea desactivar el Proveedor?',
      this.proveedorService.inactive(this.id!),
      () => {
        this.getData();
        this.puntoVentaListComponent?.reload();
      }
    );
  }
@ViewChild(PuntoVentaListComponent) puntoVentaListComponent!: PuntoVentaListComponent;

  submit(confirmed: boolean, redirectToCreatePuntoVenta: boolean): void {
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
      delete data.estado;
      data.estado = this.info.get('estado')!.value ? "Activo" : "Inactivo";
      formData.append('data', JSON.stringify(data));
      if (this.file) {
        formData.append('file', this.file);
      }
      this.hasChange = false;
      this.initialFormValue = this.form.value;
      if (this.isEdit && this.id) {
        this.proveedorService.edit(this.id, formData).subscribe(() => {
          if (redirectToCreatePuntoVenta) {
            this.router.navigate([
              `/entities/${m.PUNTO_VENTA}/${a.CREAR}`,
              this.id,
            ]);
          } else {
            this.snackbar.openUpdateAndRedirect(confirmed, this.backUrl);
            this.getData();
          }
        });
      } else {
        this.proveedorService.create(formData).subscribe((proveedor) => {
          this.snackbar.open('Datos guardados satisfactoriamente');
          if (redirectToCreatePuntoVenta) {
            this.router.navigate([
              `/entities/${m.PUNTO_VENTA}/${a.CREAR}`,
              proveedor.id,
            ]);
          } else {
            this.snackbar.openSaveAndRedirect(
              confirmed,
              this.backUrl,
              r.ENTITIES,
              m.PROVEEDOR,
              proveedor.id
            );
          }
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
      this.proveedorService.getById(this.id).subscribe((data) => {
        this.ciudadSelected = data.ciudad;
        this.isActive = data.estado === EstadoEnum.ACTIVO;
        this.form.patchValue({
          info: {
            alias: data.gestor_carga_proveedor?.alias ?? null,
            nombre: data.nombre,
            nombre_corto: data.nombre_corto,
            estado: ( data.estado === "Activo" ) ? true : false,
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

  private createPuntoVentaDialgoConfirmation(): void {
    this.dialog.confirmation(
      'Para crear un punto de venta debe guardar los cambios ¿Desea guardarlos?',
      () => {
        this.submit(false, true);
      }
    );
  }
}
