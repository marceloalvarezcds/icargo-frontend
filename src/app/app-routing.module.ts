import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: 'login',
    redirectTo: '/account/login',
    pathMatch: 'full',
  },
  {
    path: 'account',
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
        path: 'banco',
        loadChildren: () =>
          import('./banco/banco.module').then((m) => m.BancoModule),
      },
      {
        path: 'caja',
        loadChildren: () =>
          import('./caja/caja.module').then((m) => m.CajaModule),
      },
      {
        path: 'entities',
        loadChildren: () =>
          import('./entities/entities.module').then((m) => m.EntitiesModule),
      },
      {
        path: 'estado-cuenta',
        loadChildren: () =>
          import('./estado-cuenta/estado-cuenta.module').then(
            (m) => m.EstadoCuentaModule
          ),
      },
      {
        path: 'flota',
        loadChildren: () =>
          import('./flota/flota.module').then((m) => m.FlotaModule),
      },
      {
        path: 'flete',
        loadChildren: () =>
          import('./flete/flete.module').then((m) => m.FleteModule),
      },
      {
        path: 'listado',
        loadChildren: () =>
          import('./listado/listado.module').then((m) => m.ListadoModule),
      },
      {
        path: 'orden-carga',
        loadChildren: () =>
          import('./orden-carga/orden-carga.module').then(
            (m) => m.OrdenCargaModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
