import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { RolFormComponent } from './rol-form/rol-form.component';
import { RolListComponent } from './rol-list/rol-list.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: `${m.USER}/${a.LISTAR}`,
    pathMatch: 'full',
  },
  {
    path: m.USER,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      {
        path: a.LISTAR,
        component: UserListComponent,
        canActivate: [PermisoGuard],
      },
    ],
  },
  {
    path: m.ROL,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      {
        path: a.LISTAR,
        component: RolListComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: a.CREAR,
        component: RolFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.EDITAR}/:id`,
        component: RolFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.VER}/:id`,
        component: RolFormComponent,
        canActivate: [PermisoGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
