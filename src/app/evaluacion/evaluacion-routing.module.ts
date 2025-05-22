import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { EvaluacionListComponent } from './evaluacion-list/evaluacion-list.component';
import { EvaluacionFormComponent } from './evaluacion-form/evaluacion-form.component';

const routes: Routes = [
   {
      path: m.ORDEN_CARGA_EVALUACION,
      children: [
        {
          path: '',
          redirectTo: a.LISTAR,
          pathMatch: 'full',
        },
        {
          path: a.LISTAR,
          component: EvaluacionListComponent,
          canActivate: [PermisoGuard],
        },

        {
          path: `${a.VER}/:id`,
          component: EvaluacionFormComponent,
          canActivate: [PermisoGuard],
        },


      ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluacionRoutingModule { }
