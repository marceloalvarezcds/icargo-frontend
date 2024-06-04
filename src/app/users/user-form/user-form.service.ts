import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isEqual } from 'lodash';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as r,
} from 'src/app/enums/permiso-enum';
import { User } from 'src/app/interfaces/user';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { emailValidator } from 'src/app/validators/email-validator';
import { mustMatch } from 'src/app/validators/password-validator';

@Injectable({
  providedIn: 'root',
})
export class UserFormService {
  id?: number;
  isEdit = false;
  isShow = false;
  modelo = m.USER;
  backUrl = `/users/${this.modelo}/${a.LISTAR}`;
  item?: User;
  loggedUser$ = this.service.getLoggedUser();
  form = new FormGroup(
    {
      first_name: new FormControl(null, Validators.required),
      last_name: new FormControl(null, Validators.required),
      usuario: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, emailValidator]),
      contrasena: new FormControl(null),
      confirm_password: new FormControl(null),
      gestor_carga_id: new FormControl(null),
      roles: new FormControl(null, Validators.required),
    },
    {
      validators: mustMatch('contrasena', 'confirm_password'),
    }
  );
  initialFormValue = this.form.value;
  hasChange = false;
  hasChangeSubscription = this.form.valueChanges.subscribe((value) => {
    setTimeout(() => {
      this.hasChange = !isEqual(this.initialFormValue, value);
    });
  });

  set editPasswords(edit: boolean) {
    this.editPass = edit;
    if (edit) {
      this.loadPasswordsValidators();
    } else {
      this.clearPasswordsValidators();
    }
  }
  get editPasswords() {
    return this.editPass;
  }
  private editPass = false;

  get estado(): EstadoEnum {
    return this.item?.estado ?? EstadoEnum.ACTIVO;
  }

  get puedeModificar(): boolean {
    if (this.isShow) {
      return false;
    }
    return this.service.checkPermiso(a.EDITAR, this.modelo);
  }

  constructor(
    private router: Router,
    private snackbar: SnackbarService,
    private service: UserService
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
        if (typeof data[key] === 'string' && key !== 'email'  && key !== 'usuario') {
          data[key] = data[key].toUpperCase();
        }
      });  

      data.username = data.usuario;
      data.password = data.contrasena;
      delete data.usuario;
      delete data.contrasena;
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
        this.form.patchValue({
          first_name: data.first_name,
          last_name: data.last_name,
          usuario: data.username,
          email: data.email,
          gestor_carga_id: data.gestor_carga_id,
          roles: data.roles,
        });
        if (!this.puedeModificar) {
          this.form.disable();
        }
        setTimeout(() => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
        }, 500);
      });
      if (!(this.isEdit || this.isShow)) {
        this.loadPasswordsValidators();
      }
    }
  }

  private loadPasswordsValidators(): void {
    this.form.controls['contrasena'].setValidators([
      Validators.required,
      Validators.minLength(6),
    ]);
    this.form.controls['confirm_password'].setValidators(Validators.required);
    this.form.controls['contrasena'].updateValueAndValidity();
    this.form.controls['confirm_password'].updateValueAndValidity();
  }

  private clearPasswordsValidators(): void {
    this.form.controls['contrasena'].clearValidators();
    this.form.controls['confirm_password'].clearValidators();
    this.form.controls['contrasena'].updateValueAndValidity();
    this.form.controls['confirm_password'].updateValueAndValidity();
  }
}
