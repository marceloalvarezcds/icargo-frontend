import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { EstadoCuentaListComponent } from './estado-cuenta-list/estado-cuenta-list.component';
import { LiquidacionConfirmadaFormComponent } from './liquidacion-confirmada-form/liquidacion-confirmada-form.component';
import { LiquidacionEditFormComponent } from './liquidacion-edit-form/liquidacion-edit-form.component';
import { LiquidacionFinalizadaComponent } from './liquidacion-finalizada/liquidacion-finalizada.component';
import { LiquidacionFormComponent } from './liquidacion-form/liquidacion-form.component';
import { LiquidacionListComponent } from './liquidacion-list/liquidacion-list.component';

const routes: Routes = [
  {
    path: m.ESTADO_CUENTA,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      {
        path: a.LISTAR,
        component: EstadoCuentaListComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: m.LIQUIDACION,
        children: [
          {
            path: '',
            redirectTo: a.LISTAR,
            pathMatch: 'full',
          },
          {
            path: a.LISTAR,
            component: LiquidacionListComponent,
            canActivate: [PermisoGuard],
          },
          {
            path: a.CREAR,
            component: LiquidacionFormComponent,
            canActivate: [PermisoGuard],
          },
          {
            path: `${a.EDITAR}/:id`,
            component: LiquidacionEditFormComponent,
            canActivate: [PermisoGuard],
          },
          {
            path: `${a.VER}/:id`,
            component: LiquidacionEditFormComponent,
            canActivate: [PermisoGuard],
          },
        ],
      },
      {
        path: LiquidacionEtapaEnum.CONFIRMADO.toLowerCase(),
        children: [
          {
            path: m.LIQUIDACION,
            children: [
              {
                path: `${a.EDITAR}/:id`,
                component: LiquidacionConfirmadaFormComponent,
                canActivate: [PermisoGuard],
              },
              {
                path: `${a.VER}/:id`,
                component: LiquidacionConfirmadaFormComponent,
                canActivate: [PermisoGuard],
              },
            ],
          },
        ],
      },
      {
        path: m.MOVIMIENTO,
        children: [
          {
            path: '',
            redirectTo: a.LISTAR,
            pathMatch: 'full',
          },
          {
            path: a.LISTAR,
            component: LiquidacionFinalizadaComponent,
            canActivate: [PermisoGuard],
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstadoCuentaRoutingModule {}
