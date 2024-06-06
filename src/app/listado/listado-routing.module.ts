import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as u,
} from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { MovimientoListComponent } from './movimiento-list/movimiento-list.component';
import { RentabilidadListComponent } from './rentabilidad-list/rentabilidad-list.component';


export const listadoUrls = [
  {
    path: a.LISTAR,
    component: RentabilidadListComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.LISTADO}/${m.RENTABILIDAD}/${a.LISTAR}`,
    },
  },
  {
    path: a.LISTAR,
    component: MovimientoListComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.LISTADO}/${m.MOVIMIENTO}/${a.LISTAR}`,
    },
  },
];



const routes: Routes = [
  {
    path: m.RENTABILIDAD,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      ...listadoUrls,
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
      ...listadoUrls,
    ],
  },
];

// const routes: Routes = [
//   {
//     path: m.RENTABILIDAD,
//     children: [
//       {
//         path: '',
//         redirectTo: a.LISTAR,
//         pathMatch: 'full',
//       },
//       {
//         path: a.LISTAR,
//         component: RentabilidadListComponent,
//         canActivate: [PermisoGuard],
//       },
//     ],
//   },
//   {
//     path: m.MOVIMIENTO,
//     children: [
//       {
//         path: '',
//         redirectTo: a.LISTAR,
//         pathMatch: 'full',
//       },
//       {
//         path: a.LISTAR,
//         component: MovimientoListComponent,
//         canActivate: [PermisoGuard],
//       },
//     ],
//   },
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListadoRoutingModule {}
