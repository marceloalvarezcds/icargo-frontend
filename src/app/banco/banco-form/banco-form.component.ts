import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isEqual } from 'lodash';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as r,
} from 'src/app/enums/permiso-enum';
import { Banco } from 'src/app/interfaces/banco';
import { ActivatedRouteService } from 'src/app/services/activated-route.service';
import { BancoService } from 'src/app/services/banco.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-banco-form',
  templateUrl: './banco-form.component.html',
  styleUrls: ['./banco-form.component.scss'],
})
export class BancoFormComponent implements OnInit, OnDestroy {
  id!: number;
  isEdit = false;
  isShow = false;
  backUrl = `/banco/${m.BANCO}/${a.LISTAR}`;
  modelo = m.BANCO;
  item?: Banco;
  form = this.fb.group({
    numero_cuenta: [null, Validators.required],
    titular: [null, Validators.required],
    nombre: [null, Validators.required],
    moneda_id: [null, Validators.required],
  });
  initialFormValue = this.form.value;
  hasChange = false;
  hasChangeSubscription = this.form.valueChanges.subscribe((value) => {
    setTimeout(() => {
      this.hasChange = !isEqual(this.initialFormValue, value);
    });
  });

  get gestorCargaId(): number | undefined {
    return this.item?.gestor_carga_id;
  }

  get puedeModificar(): boolean {
    if (this.isShow) {
      return false;
    }
    return this.userService.checkPermisoAndGestorCargaId(
      a.EDITAR,
      this.modelo,
      this.gestorCargaId
    );
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRouteService,
    private router: Router,
    private snackbar: SnackbarService,
    private bancoService: BancoService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    this.hasChangeSubscription.unsubscribe();
  }

  redirectToEdit(): void {
    this.router.navigate([`/banco/${m.BANCO}/${a.EDITAR}`, this.id]);
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
      // Convertir propiedades a mayúsculas, excepto los correos electrónicos
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string' && key !== 'email') {
          data[key] = data[key].toUpperCase();
        }
      });  
              
      formData.append('data', JSON.stringify(data));

      this.hasChange = false;
      this.initialFormValue = this.form.value;
      if (this.isEdit) {
        this.bancoService.edit(this.id, formData).subscribe(() => {
          this.snackbar.openUpdateAndRedirect(confirmed, this.backUrl);
          this.getData();
        });
      } else {
        this.bancoService.create(formData).subscribe((banco) => {
          this.snackbar.openSaveAndRedirect(
            confirmed,
            this.backUrl,
            r.BANCO,
            m.BANCO,
            banco.id || this.id
          );
        });
      }
    }
  }

  getData(): void {
    const backUrl = this.route.snapshot.queryParams.backUrl;
    if (backUrl) {
      this.backUrl = backUrl;
    }
    this.id = +this.route.snapshot.params.id;
    if (this.id) {
      this.isEdit = /edit/.test(this.route.url);
      this.isShow = /ver/.test(this.route.url);
      this.bancoService.getById(this.id).subscribe((data) => {
        this.item = data;
        this.form.patchValue({
          numero_cuenta: data.numero_cuenta,
          titular: data.titular,
          nombre: data.nombre,
          moneda_id: data.moneda_id,
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
