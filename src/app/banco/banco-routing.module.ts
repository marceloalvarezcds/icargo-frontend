import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as u,
} from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { BancoFormComponent } from './banco-form/banco-form.component';
import { BancoListComponent } from './banco-list/banco-list.component';

export const bancoUrls = [
  {
    path: a.LISTAR,
    component: BancoListComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.BANCO}/${m.BANCO}/${a.LISTAR}`,
    },
  },
  {
    path: a.CREAR,
    component: BancoFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.BANCO}/${m.BANCO}/${a.CREAR}`,
    },
  },
  {
    path: `${a.EDITAR}/:id`,
    component: BancoFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.BANCO}/${m.BANCO}/${a.EDITAR}`,
    },
  },
  {
    path: `${a.VER}/:id`,
    component: BancoFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.BANCO}/${m.BANCO}/${a.VER}`,
    },
  },
];

const routes: Routes = [
  {
    path: m.BANCO,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      ...bancoUrls,
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BancoRoutingModule {}
