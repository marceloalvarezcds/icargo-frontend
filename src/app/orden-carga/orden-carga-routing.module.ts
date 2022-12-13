import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as u,
} from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { OrdenCargaCreateFormComponent } from './orden-carga-create-form/orden-carga-create-form.component';
import { OrdenCargaEditFormComponent } from './orden-carga-edit-form/orden-carga-edit-form.component';
import { OrdenCargaListComponent } from './orden-carga-list/orden-carga-list.component';

export const ordenCargaUrls = [
  {
    path: a.LISTAR,
    component: OrdenCargaListComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ORDEN_CARGA}/${m.ORDEN_CARGA}/${a.LISTAR}`,
    },
  },
  {
    path: a.CREAR,
    component: OrdenCargaCreateFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ORDEN_CARGA}/${m.ORDEN_CARGA}/${a.CREAR}`,
    },
  },
  {
    path: `${a.EDITAR}/:id`,
    component: OrdenCargaEditFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ORDEN_CARGA}/${m.ORDEN_CARGA}/${a.EDITAR}`,
    },
  },
  {
    path: `${a.VER}/:id`,
    component: OrdenCargaEditFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ORDEN_CARGA}/${m.ORDEN_CARGA}/${a.VER}`,
    },
  },
];

const routes: Routes = [
  {
    path: m.ORDEN_CARGA,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      ...ordenCargaUrls,
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdenCargaRoutingModule {}
