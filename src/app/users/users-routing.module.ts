import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as u,
} from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { RolFormComponent } from './rol-form/rol-form.component';
import { RolListComponent } from './rol-list/rol-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserListComponent } from './user-list/user-list.component';



export const usersUrls = [
  {
    path: a.LISTAR,
    component: UserListComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.USERS}/${m.USER}/${a.LISTAR}`,
    },
  },
  {
    path: a.CREAR,
    component: UserFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.USERS}/${m.USER}/${a.CREAR}`,
    },
  },
  {
    path: `${a.EDITAR}/:id`,
    component: UserFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.USERS}/${m.USER}/${a.EDITAR}`,
    },
  },
  {
    path: `${a.VER}/:id`,
    component: UserFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.USERS}/${m.USER}/${a.VER}`,
    },
  },

];

export const rolUrls = [
  {
    path: a.LISTAR,
    component: RolListComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.USERS}/${m.ROL}/${a.LISTAR}`,
    },
  },
  {
    path: a.CREAR,
    component: RolFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.USERS}/${m.ROL}/${a.CREAR}`,
    },
  },
  {
    path: `${a.EDITAR}/:id`,
    component: RolFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.USERS}/${m.ROL}/${a.EDITAR}`,
    },
  },
  {
    path: `${a.VER}/:id`,
    component: RolFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.USERS}/${m.ROL}/${a.VER}`,
    },
  },

];



const routes: Routes = [
  {
    path: m.USER,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      ...usersUrls,
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
      ...rolUrls,
    ],
  },
];
// const routes: Routes = [
//   {
//     path: '',
//     redirectTo: `${m.USER}/${a.LISTAR}`,
//     pathMatch: 'full',
//   },
//   {
//     path: m.USER,
//     children: [
//       {
//         path: '',
//         redirectTo: a.LISTAR,
//         pathMatch: 'full',
//       },
//       {
//         path: a.LISTAR,
//         component: UserListComponent,
//         canActivate: [PermisoGuard],
//       },
//       {
//         path: a.CREAR,
//         component: UserFormComponent,
//         canActivate: [PermisoGuard],
//       },
//       {
//         path: `${a.EDITAR}/:id`,
//         component: UserFormComponent,
//         canActivate: [PermisoGuard],
//       },
//       {
//         path: `${a.VER}/:id`,
//         component: UserFormComponent,
//         canActivate: [PermisoGuard],
//       },
//     ],
//   },
//   {
//     path: m.ROL,
//     children: [
//       {
//         path: '',
//         redirectTo: a.LISTAR,
//         pathMatch: 'full',
//       },
//       {
//         path: a.LISTAR,
//         component: RolListComponent,
//         canActivate: [PermisoGuard],
//       },
//       {
//         path: a.CREAR,
//         component: RolFormComponent,
//         canActivate: [PermisoGuard],
//       },
//       {
//         path: `${a.EDITAR}/:id`,
//         component: RolFormComponent,
//         canActivate: [PermisoGuard],
//       },
//       {
//         path: `${a.VER}/:id`,
//         component: RolFormComponent,
//         canActivate: [PermisoGuard],
//       },
//     ],
//   },
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
