import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isEqual } from 'lodash';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as r,
} from 'src/app/enums/permiso-enum';
import { Rol } from 'src/app/interfaces/rol';
import { PermisoService } from 'src/app/services/permiso.service';
import { RolService } from 'src/app/services/rol.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class RolFormService {
  id?: number;
  isEdit = false;
  isShow = false;
  modelo = m.ROL;
  backUrl = `/users/${this.modelo}/${a.LISTAR}`;
  item?: Rol;
  form = this.fb.group({
    descripcion: [null, Validators.required],
    permisos: [null, Validators.required],
    gestor_carga_id: null,
  });
  initialFormValue = this.form.value;
  hasChange = false;
  hasChangeSubscription = this.form.valueChanges.subscribe((value) => {
    setTimeout(() => {
      this.hasChange = !isEqual(this.initialFormValue, value);
    });
  });

  get estado(): EstadoEnum {
    return this.item?.estado ?? EstadoEnum.ACTIVO;
  }

  get puedeModificar(): boolean {
    if (this.isShow) {
      return false;
    }
    return this.userService.checkPermiso(a.EDITAR, this.modelo);
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbar: SnackbarService,
    private service: RolService,
    private userService: UserService,
    private permisoService: PermisoService
  ) {}

  setBackUrl(backUrl: string | undefined): void {
    if (backUrl) {
      this.backUrl = backUrl;
    }
  }

  setId(id: string | undefined): void {
    this.id = id ? parseInt(id, 10) : undefined;
  }

  unsubscribe(): void {
    this.hasChangeSubscription.unsubscribe();
  }

  redirectToEdit(): void {
    this.router.navigate([`/users/${this.modelo}/${a.EDITAR}`, this.id]);
  }

  back(confirmed: boolean): void {
    if (confirmed) {
      this.submit(confirmed);
    } else {
      this.router.navigate([this.backUrl]);
    }
  }

  submit(confirmed: boolean): void {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const formData = new FormData();
      const data = JSON.parse(JSON.stringify(this.form.value));
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string' && key !== 'email') {
          data[key] = data[key].toUpperCase();
        }
      });

      formData.append('data', JSON.stringify(data));
      this.hasChange = false;
      this.initialFormValue = this.form.value;
      if (this.isEdit) {
        this.service.edit(this.id!, formData).subscribe(() => {
          this.snackbar.openUpdateAndRedirect(confirmed, this.backUrl);
          this.getData();
        });
      } else {
        this.service.create(formData).subscribe((item) => {
          this.snackbar.openSaveAndRedirect(
            confirmed,
            this.backUrl,
            r.USERS,
            this.modelo,
            item.id
          );
        });
      }
    }
  }

  getData(): void {
    if (this.id) {
      this.isEdit = /edit/.test(this.router.url);
      this.isShow = /ver/.test(this.router.url);
      this.service.getById(this.id).subscribe((data) => {
        this.item = data;
        this.form.setValue({
          descripcion: data.descripcion,
          permisos: data.permisos,
          gestor_carga_id: data.gestor_carga_id,
        });
        if (!this.puedeModificar) {
          this.form.disable();
        }
        setTimeout(() => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
        }, 500);
      });
    } else {
      // Nuevo rol → cargar lista completa de permisos y marcar los permisos por defecto
      this.permisoService.getList().subscribe((permisosList) => {
        const permisosPorDefectoModelosAccion = [
          { modelo_titulo: '1 - Propietario', accion: 'ver' },
          { modelo_titulo: '2 - Chofer', accion: 'ver' },
          { modelo_titulo: '3 - Tracto', accion: 'ver' },
          { modelo_titulo: '4 - Semi', accion: 'ver' },
          { modelo_titulo: '6 - Combinaciones', accion: 'ver' },
          { modelo_titulo: 'Flete', accion: 'ver' },
          { modelo_titulo: '4 - Saldo de Anticipo', accion: 'crear' },
          { modelo_titulo: '4 - Saldo de Anticipo', accion: 'listar' },
          { modelo_titulo: '4 - Saldo de Anticipo', accion: 'editar' },
          { modelo_titulo: '4 - Saldo de Anticipo', accion: 'ver' },
              // Parámetros del Sistema
          { modelo_titulo: 'Ciudad', accion: 'listar' },
          { modelo_titulo: 'Clasificación Centro Operativo', accion: 'listar' },
          { modelo_titulo: 'Clasificación de Semi', accion: 'listar' },
          { modelo_titulo: 'Color', accion: 'listar' },
          { modelo_titulo: 'Composición Jurídica', accion: 'listar' },
          { modelo_titulo: 'Concepto de Complemento', accion: 'listar' },
          { modelo_titulo: 'Concepto de Descuento', accion: 'listar' },
          { modelo_titulo: 'Ente emisor de Registro Automotor', accion: 'listar' },
          { modelo_titulo: 'Ente emisor de Registro de Transporte', accion: 'listar' },
          { modelo_titulo: 'Insumo', accion: 'listar' },
          { modelo_titulo: 'Insumo', accion: 'ver' },
          { modelo_titulo: 'Localidad', accion: 'listar' },
          { modelo_titulo: 'Marca de Semi', accion: 'listar' },
          { modelo_titulo: 'Marca de Tracto', accion: 'listar' },
          { modelo_titulo: 'Moneda', accion: 'listar' },
          { modelo_titulo: 'País', accion: 'listar' },
          { modelo_titulo: 'Producto', accion: 'listar' },
          { modelo_titulo: 'Texto Legal', accion: 'cambiar_estado' },
          { modelo_titulo: 'Texto Legal', accion: 'crear' },
          { modelo_titulo: 'Texto Legal', accion: 'editar' },
          { modelo_titulo: 'Texto Legal', accion: 'listar' },
          { modelo_titulo: 'Texto Legal', accion: 'ver' },
          { modelo_titulo: 'Tipo Persona', accion: 'listar' },
          { modelo_titulo: 'Tipo de Carga', accion: 'listar' },
          { modelo_titulo: 'Tipo de Comprobante', accion: 'listar' },
          { modelo_titulo: 'Tipo de Contraparte', accion: 'listar' },
          { modelo_titulo: 'Tipo de Cuenta', accion: 'listar' },
          { modelo_titulo: 'Tipo de Documento', accion: 'listar' },
          { modelo_titulo: 'Tipo de Documento Relacionado', accion: 'listar' },
          { modelo_titulo: 'Tipo de IVA', accion: 'listar' },
          { modelo_titulo: 'Tipo de Instrumento', accion: 'listar' },
          { modelo_titulo: 'Tipo de Insumo', accion: 'listar' },
          { modelo_titulo: 'Tipo de Movimiento', accion: 'listar' },
          { modelo_titulo: 'Tipo de Registro', accion: 'listar' },
          { modelo_titulo: 'Tipo de Semi', accion: 'listar' },
          { modelo_titulo: 'Tipo de Tracto', accion: 'listar' },
          { modelo_titulo: 'Unidad', accion: 'listar' },
          { modelo_titulo: 'Vía de Instrumento', accion: 'listar' },
        ];

        const permisosPorDefecto = permisosPorDefectoModelosAccion
          .map(def =>
            permisosList.find(
              p => p.modelo_titulo === def.modelo_titulo && p.accion === def.accion
            )
          )
          .filter(p => p != null);

        this.form.setValue({
          descripcion: '',
          permisos: permisosPorDefecto,
          gestor_carga_id: null,
        });
        this.hasChange = false;
        this.initialFormValue = this.form.value;
      });
    }
  }
}
