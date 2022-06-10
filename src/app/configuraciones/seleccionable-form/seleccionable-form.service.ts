import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isEqual } from 'lodash';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { SeleccionableBaseModel } from 'src/app/interfaces/seleccionable';
import { DialogService } from 'src/app/services/dialog.service';
import { SeleccionableService } from 'src/app/services/seleccionable.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class SeleccionableFormService {
  id?: number;
  isEdit = false;
  isShow = false;
  backUrl = '';
  modelo!: m;
  submodule!: string;
  changeStatusMsg!: string;
  item?: SeleccionableBaseModel;
  form = this.fb.group({
    descripcion: [null, Validators.required],
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

  get isActive(): boolean {
    return this.estado === EstadoEnum.ACTIVO;
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
    private dialog: DialogService,
    private snackbar: SnackbarService,
    private service: SeleccionableService,
    private userService: UserService
  ) {}

  setBackUrl(backUrl: string): void {
    this.backUrl = backUrl;
  }

  setChangeStatusMsg(changeStatusMsg: string): void {
    this.changeStatusMsg = changeStatusMsg;
  }

  setEndpoint(endpoint: string): void {
    this.service.setEndpoint(endpoint);
  }

  setId(id: string | undefined): void {
    this.id = id ? parseInt(id, 10) : undefined;
  }

  setModelo(modelo: m): void {
    this.modelo = modelo;
    this.backUrl = `/config/${modelo}/${a.LISTAR}`;
  }

  setSubmodule(submodule: string): void {
    this.submodule = submodule;
  }

  unsubscribe(): void {
    this.hasChangeSubscription.unsubscribe();
  }

  active(): void {
    this.dialog.changeStatusConfirm(
      `¿Está seguro que desea activar ${this.changeStatusMsg}?`,
      this.service.active(this.id!),
      () => {
        this.getData();
      }
    );
  }

  inactive(): void {
    this.dialog.changeStatusConfirm(
      `¿Está seguro que desea desactivar ${this.changeStatusMsg}?`,
      this.service.inactive(this.id!),
      () => {
        this.getData();
      }
    );
  }

  redirectToEdit(): void {
    this.router.navigate([`/config/${this.modelo}/${a.EDITAR}`, this.id]);
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
        this.service.create(formData).subscribe(() => {
          this.snackbar.openSaveAndRedirect(confirmed, this.backUrl, [
            `/config/${this.modelo}/${a.EDITAR}`,
            this.id,
          ]);
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
          gestor_carga_id: null, //data.gestor_carga_id,
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
