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
    private userService: UserService
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
    }
  }
}
