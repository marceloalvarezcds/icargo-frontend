import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as r,
} from 'src/app/enums/permiso-enum';
import { MonedaCotizacion } from 'src/app/interfaces/moneda_cotizacion';
import { GestorCargaService } from 'src/app/services/gestor-carga.service';
import { MonedaCotizacionService } from 'src/app/services/moneda-cotizacion.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-moneda-cotizacion-form',
  templateUrl: './moneda-cotizacion-form.component.html',
  styleUrls: ['./moneda-cotizacion-form.component.scss']
})
export class MonedaCotizacionFormComponent implements OnInit {
  id!: number;
  isEdit = false;
  isShow = false;
  gestor_carga?: string;
  backUrl = `/cotizacion/${m.MONEDA_COTIZACION}/${a.LISTAR}`;
  modelo = m.MONEDA_COTIZACION;
  item?: MonedaCotizacion;
  gestorCargaId: number | null = null;
  form = this.fb.group({
      gestor_carga_id: null,
      gestor_carga_nombre: null,
      moneda_origen_id: [null, Validators.required],
      moneda_destino_id: 1,
      fecha: [null, Validators.required],
      cotizacion_moneda: [null, Validators.required],
  });
    initialFormValue = this.form.value;
    hasChange = false;
    hasChangeSubscription = this.form.valueChanges.subscribe((value) => {
      setTimeout(() => {
        this.hasChange = !isEqual(this.initialFormValue, value);
      });
    });

  constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private snackbar: SnackbarService,
      private userService: UserService,
      private gestorCargaService: GestorCargaService,
      private monedaCotizacionService: MonedaCotizacionService,) { }

  ngOnInit(): void {
    this.getData();

    this.userService.getLoggedUser().subscribe((user) => {
      const gestorCargaId = user?.gestor_carga_id;
      if (!gestorCargaId) return;

      this.gestorCargaId = gestorCargaId;

      this.gestorCargaService.getById(gestorCargaId).subscribe((gestorCarga) => {
        this.gestor_carga = gestorCarga?.nombre ?? null;
      });
    });

    this.form.get('moneda_destino_id')?.disable();

    this.form.get('moneda_origen_id')?.valueChanges.subscribe((monedaOrigenId: number) => {
      const monedaDestinoId = this.form.get('moneda_destino_id')?.value;

      if (monedaOrigenId && monedaDestinoId && this.gestorCargaId) {
        this.monedaCotizacionService
          .get_cotizacion_by_moneda(monedaOrigenId, monedaDestinoId)
          .subscribe((cotizacion) => {
            this.form.get('cotizacion_moneda')?.setValue(cotizacion?.cotizacion_moneda ?? null);
            this.form.get('fecha')?.setValue(cotizacion?.fecha ?? null);
          });
      }
    });
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
      const data = JSON.parse(JSON.stringify(this.form.value));
      data.gestor_carga_id = this.gestorCargaId;
      data.moneda_destino_id = 1;
      delete data.gestor_carga_nombre;

      if (data.fecha) {
        const fechaObj = new Date(data.fecha);
        if (!isNaN(fechaObj.getTime())) {
          data.fecha = fechaObj.toISOString().slice(0, 10);
        }
      }

      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string' && key !== 'email') {
          data[key] = data[key].toUpperCase();
        }
      });

      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      this.hasChange = false;
      this.initialFormValue = this.form.value;

      this.monedaCotizacionService.create(formData).subscribe((monedaCotizacion) => {
        this.snackbar.openSaveAndRedirect(
          confirmed,
          this.backUrl,
          r.MONEDA_COTIZACION,
          m.MONEDA_COTIZACION,
          monedaCotizacion.id
        );
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
      // if (this.isEdit) {
      //   this.enableOtherFields();
      // }
      this.monedaCotizacionService.getById(this.id).subscribe((data) => {
        this.item = data;
        this.form.patchValue({
          gestor_carga_id: data.gestor_carga_id,
          gestor_carga_nombre: data.gestor_carga_nombre ?? null,
          moneda_origen_id: data.moneda_origen_id,
          moneda_destino_id: 1,
          fecha: data.fecha,
          cotizacion_moneda: data.cotizacion_moneda,

        });

        setTimeout(() => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
        }, 500);
      });
    }
  }
}
