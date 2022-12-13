import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as u,
} from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { EstadoCuentaListComponent } from './estado-cuenta-list/estado-cuenta-list.component';
import { LiquidacionConfirmadaFormComponent } from './liquidacion-confirmada-form/liquidacion-confirmada-form.component';
import { LiquidacionEditFormComponent } from './liquidacion-edit-form/liquidacion-edit-form.component';
import { LiquidacionFinalizadaComponent } from './liquidacion-finalizada/liquidacion-finalizada.component';
import { LiquidacionFormComponent } from './liquidacion-form/liquidacion-form.component';
import { LiquidacionListComponent } from './liquidacion-list/liquidacion-list.component';

const confirmado = LiquidacionEtapaEnum.CONFIRMADO.toLowerCase();

export const estadoCuentaUrls = [
  {
    path: a.LISTAR,
    component: EstadoCuentaListComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ESTADO_CUENTA}/${m.ESTADO_CUENTA}/${a.LISTAR}`,
    },
  },
];

export const liquidacionUrls = [
  {
    path: a.LISTAR,
    component: LiquidacionListComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ESTADO_CUENTA}/${m.ESTADO_CUENTA}/${m.LIQUIDACION}/${a.LISTAR}`,
    },
  },
  {
    path: a.CREAR,
    component: LiquidacionFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ESTADO_CUENTA}/${m.ESTADO_CUENTA}/${m.LIQUIDACION}/${a.CREAR}`,
    },
  },
  {
    path: `${a.EDITAR}/:id`,
    component: LiquidacionEditFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ESTADO_CUENTA}/${m.ESTADO_CUENTA}/${m.LIQUIDACION}/${a.EDITAR}`,
    },
  },
  {
    path: `${a.VER}/:id`,
    component: LiquidacionEditFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ESTADO_CUENTA}/${m.ESTADO_CUENTA}/${m.LIQUIDACION}/${a.VER}`,
    },
  },
];

export const liquidacionConfirmadaUrls = [
  {
    path: `${a.EDITAR}/:id`,
    component: LiquidacionConfirmadaFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ESTADO_CUENTA}/${m.ESTADO_CUENTA}/${confirmado}/${m.LIQUIDACION}/${a.LISTAR}`,
    },
  },
  {
    path: `${a.VER}/:id`,
    component: LiquidacionConfirmadaFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ESTADO_CUENTA}/${m.ESTADO_CUENTA}/${confirmado}/${m.LIQUIDACION}/${a.LISTAR}`,
    },
  },
];

export const movimientosUrls = [
  {
    path: a.LISTAR,
    component: LiquidacionFinalizadaComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ESTADO_CUENTA}/${m.ESTADO_CUENTA}/${m.MOVIMIENTO}/${a.LISTAR}`,
    },
  },
];

const routes: Routes = [
  {
    path: m.ESTADO_CUENTA,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      ...estadoCuentaUrls,
      {
        path: m.LIQUIDACION,
        children: [
          {
            path: '',
            redirectTo: a.LISTAR,
            pathMatch: 'full',
          },
          ...liquidacionUrls,
        ],
      },
      {
        path: confirmado,
        children: [
          {
            path: m.LIQUIDACION,
            children: [...liquidacionConfirmadaUrls],
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
          ...movimientosUrls,
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
