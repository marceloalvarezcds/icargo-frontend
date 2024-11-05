import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermisoModuloRouterEnum } from './enums/permiso-enum';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: PermisoModuloRouterEnum.LOGIN,
    redirectTo: '/account/login',
    pathMatch: 'full',
  },
  {
    path: PermisoModuloRouterEnum.ACCOUNT,
    loadChildren: () =>
      import('./account/account.module').then((m) => m.AccountModule),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: PermisoModuloRouterEnum.BANCO,
        loadChildren: () =>
          import('./banco/banco.module').then((m) => m.BancoModule),
      },
      {
        path: PermisoModuloRouterEnum.CAJA,
        loadChildren: () =>
          import('./caja/caja.module').then((m) => m.CajaModule),
      },
      {
        path: PermisoModuloRouterEnum.BIBLIOTECA,
        loadChildren: () =>
          import('./biblioteca/biblioteca.module').then(
            (m) => m.BibliotecaModule
          ),
      },
      {
        path: PermisoModuloRouterEnum.ENTITIES,
        loadChildren: () =>
          import('./entities/entities.module').then((m) => m.EntitiesModule),
      },
      {
        path: PermisoModuloRouterEnum.ESTADO_CUENTA,
        loadChildren: () =>
          import('./estado-cuenta/estado-cuenta.module').then(
            (m) => m.EstadoCuentaModule
          ),
      },
      {
        path: PermisoModuloRouterEnum.FLOTA,
        loadChildren: () =>
          import('./flota/flota.module').then((m) => m.FlotaModule),
      },
      {
        path: PermisoModuloRouterEnum.FLETE,
        loadChildren: () =>
          import('./flete/flete.module').then((m) => m.FleteModule),
      },
      {
        path: PermisoModuloRouterEnum.LISTADO,
        loadChildren: () =>
          import('./listado/listado.module').then((m) => m.ListadoModule),
      },
      {
        path: PermisoModuloRouterEnum.ORDEN_CARGA,
        loadChildren: () =>
          import('./orden-carga/orden-carga.module').then(
            (m) => m.OrdenCargaModule
          ),
      },
      {
        path: PermisoModuloRouterEnum.INSUMO_PUNTO_VENTA_PRECIO,
        loadChildren: () =>
          import('./insumo/insumo.module').then(
            (m) => m.InsumoModule
          ),
      },
      {
        path: PermisoModuloRouterEnum.PARAMETROS,
        loadChildren: () =>
          import('./parametros/parametros.module').then(
            (m) => m.ParametrosModule
          ),
      },
      {
        path: PermisoModuloRouterEnum.USERS,
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
      },
      { path: '**', component: PageNotFoundComponent }, // Wildcard route for a 404 page
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
