import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { CamionFormComponent } from './camion-form/camion-form.component';
import { CamionListComponent } from './camion-list/camion-list.component';
import { ChoferFormComponent } from './chofer-form/chofer-form.component';
import { ChoferListComponent } from './chofer-list/chofer-list.component';
import { PropietarioFormComponent } from './propietario-form/propietario-form.component';
import { PropietarioListComponent } from './propietario-list/propietario-list.component';
import { SemiFormComponent } from './semi-form/semi-form.component';
import { SemiListComponent } from './semi-list/semi-list.component';
import { CombinacionListComponent } from './combinacion-list/combinacion-list.component'
import { CombinacionFormComponent } from './combinacion-form/combinacion-form.component';

const routes: Routes = [
  {
    path: m.COMBINACION,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      {
        path: a.LISTAR,
        component: CombinacionListComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: a.CREAR,
        component: CombinacionFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.EDITAR}/:id`,
        component: CombinacionFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.VER}/:id`,
        component: CombinacionFormComponent,
        canActivate: [PermisoGuard],
      },
    ],
  },
  {
    path: m.PROPIETARIO,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      {
        path: a.LISTAR,
        component: PropietarioListComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: a.CREAR,
        component: PropietarioFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.EDITAR}/:id`,
        component: PropietarioFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.VER}/:id`,
        component: PropietarioFormComponent,
        canActivate: [PermisoGuard],
      },
    ],
  },

  {
    path: m.CHOFER,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      {
        path: a.LISTAR,
        component: ChoferListComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: a.CREAR,
        component: ChoferFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.EDITAR}/:id`,
        component: ChoferFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.VER}/:id`,
        component: ChoferFormComponent,
        canActivate: [PermisoGuard],
      },
    ],
  },
  {
    path: m.CAMION,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      {
        path: a.LISTAR,
        component: CamionListComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: a.CREAR,
        component: CamionFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.EDITAR}/:id`,
        component: CamionFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.VER}/:id`,
        component: CamionFormComponent,
        canActivate: [PermisoGuard],
      },
    ],
  },
  {
    path: m.SEMIRREMOLQUE,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      {
        path: a.LISTAR,
        component: SemiListComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: a.CREAR,
        component: SemiFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.EDITAR}/:id`,
        component: SemiFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.VER}/:id`,
        component: SemiFormComponent,
        canActivate: [PermisoGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlotaRoutingModule {}
