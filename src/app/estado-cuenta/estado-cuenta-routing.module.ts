import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { EstadoCuentaListComponent } from './estado-cuenta-list/estado-cuenta-list.component';
import { LiquidacionFormComponent } from './liquidacion-form/liquidacion-form.component';

const routes: Routes = [
  {
    path: m.ESTADO_CUENTA,
    children: [
      {
        path: a.LISTAR,
        component: EstadoCuentaListComponent,
        canActivate: [PermisoGuard],
      },
    ],
  },
  {
    path: m.LIQUIDACION,
    children: [
      {
        path: a.CREAR,
        component: LiquidacionFormComponent,
        canActivate: [PermisoGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstadoCuentaRoutingModule {}
