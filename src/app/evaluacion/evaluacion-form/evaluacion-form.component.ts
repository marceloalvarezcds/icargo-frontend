import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdenCargaEvaluacionesService } from 'src/app/services/orden-carga-evaluaciones.service';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as r,
} from 'src/app/enums/permiso-enum';
import { FormBuilder, Validators } from '@angular/forms';
import { isEqual } from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { OrdenCargaEvaluacionesHistorial } from 'src/app/interfaces/orden_carga_evaluacion';

@Component({
  selector: 'app-evaluacion-form',
  templateUrl: './evaluacion-form.component.html',
  styleUrls: ['./evaluacion-form.component.scss']
})
export class EvaluacionFormComponent implements OnInit, OnDestroy  {
  isEdit = false;
  isShow = false;
  modelo = m.ORDEN_CARGA_EVALUACION;
  proveedor?: string;
  tipoInsumo?: string;
  backUrl = `/orden_carga_evaluacion/${m.ORDEN_CARGA_EVALUACION}/${a.LISTAR}`;
  id?: number;
  item?: OrdenCargaEvaluacionesHistorial;
  insumoPdvId: number | null = null;
  nota: string | null = null;
  tipoInsumoList$ =
  this.evaluacionService.getList();

  form = this.fb.group({
      orden_carga_id: [null, Validators.required],
      oc_camion_placa: [null, Validators.required],
      oc_semi_placa: null,
      oc_chofer_nombre: null,
      oc_propietario_nombre: null,
      promedio_tracto_gestor: null,
      promedio_tracto_general: null,
      promedio_semi_gestor: null,
      promedio_semi_general: null,
      promedio_chofer_gestor: null,
      promedio_chofer_general: null,
      promedio_propietario_gestor: null,
      promedio_propietario_general: null,
      comentarios: null,
      nota: null,
  });
  initialFormValue = this.form.value;
  hasChange = false;
  hasChangeSubscription = this.form.valueChanges.subscribe((value) => {
    setTimeout(() => {
      this.hasChange = !isEqual(this.initialFormValue, value);
    });
  });

  constructor(
      private evaluacionService: OrdenCargaEvaluacionesService,
      private fb: FormBuilder,
      private router: Router,
      private route: ActivatedRoute,
      private snackbar: SnackbarService,) { }

  ngOnInit(): void {
    this.getData()
  }

  ngOnDestroy(): void {
    this.hasChangeSubscription.unsubscribe();
  }

  back(confirmed: boolean): void {
    this.router.navigate([this.backUrl]);
  }


  private getData(): void {
    this.id = +this.route.snapshot.params.id;
    if (this.id) {
      this.isEdit = /edit/.test(this.router.url);
      this.isShow = /ver/.test(this.router.url);
      if (this.isShow) {
        this.form.disable();
      }
      this.evaluacionService.getById(this.id).subscribe((data) => {
        this.item = data;
        this.nota = data.nota !== undefined ? data.nota : null;

        this.form.patchValue({
          orden_carga_id: data.orden_carga_id,
          oc_camion_placa: data.oc_camion_placa,
          oc_semi_placa: data.oc_semi_placa,
          oc_chofer_nombre: data.oc_chofer_nombre,
          oc_propietario_nombre: data.oc_beneficiario_nombre,
          promedio_tracto_gestor: data.promedio_tracto_gestor,
          promedio_tracto_general: data.promedio_tracto_general,
          promedio_semi_gestor: data.promedio_semi_gestor,
          promedio_semi_general: data.promedio_semi_general,
          promedio_chofer_gestor: data.promedio_chofer_gestor,
          promedio_chofer_general: data.promedio_chofer_general,
          promedio_propietario_gestor: data.promedio_propietario_gestor,
          promedio_propietario_general: data.promedio_propietario_general,
          comentarios: data.comentarios,
          nota: this.nota,
        });

        setTimeout(() => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
        }, 500);
      });
    }
  }

}
