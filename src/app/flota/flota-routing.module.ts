import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as u,
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

export const combinacionUrls = [
  {
    path: a.LISTAR,
    component: CombinacionListComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.FLOTA}/${m.COMBINACION}/${a.LISTAR}`,
    },
  },
  {
    path: a.CREAR,
    component: CombinacionFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.FLOTA}/${m.COMBINACION}/${a.CREAR}`,
    },
  },
  {
    path: `${a.EDITAR}/:id`,
    component: CombinacionFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.FLOTA}/${m.COMBINACION}/${a.EDITAR}`,
    },
  },
  {
    path: `${a.VER}/:id`,
    component: CombinacionFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.FLOTA}/${m.COMBINACION}/${a.VER}`,
    },
  },
];

export const propietarioUrls = [
  {
    path: a.LISTAR,
    component: PropietarioListComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.FLOTA}/${m.PROPIETARIO}/${a.LISTAR}`,
    },
  },
  {
    path: a.CREAR,
    component: PropietarioFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.FLOTA}/${m.PROPIETARIO}/${a.CREAR}`,
      menuPath: `${u.FLOTA}/${m.PROPIETARIO}/${a.CREAR}`, 
    },
  },
  {
    path: `${a.EDITAR}/:id`,
    component: PropietarioFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.FLOTA}/${m.PROPIETARIO}/${a.EDITAR}`,
      
    },
  },
  {
    path: `${a.VER}/:id`,
    component: PropietarioFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.FLOTA}/${m.PROPIETARIO}/${a.VER}`,
    
    },
  },
];

export const choferUrls = [
  {
    path: a.LISTAR,
    component: ChoferListComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.FLOTA}/${m.CHOFER}/${a.LISTAR}`,
    },
  },
  {
    path: a.CREAR,
    component: ChoferFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.CHOFER}/${a.CREAR}`,
    },
  },
  {
    path: `${a.EDITAR}/:id`,
    component: ChoferFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.CHOFER}/${a.EDITAR}`,
    },
  },
  {
    path: `${a.VER}/:id`,
    component: ChoferFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.CHOFER}/${a.VER}`,
    },
  },
];

export const camionUrls = [
  {
    path: a.LISTAR,
    component: CamionListComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.FLOTA}/${m.CAMION}/${a.LISTAR}`,
    },
  },
  {
    path: a.CREAR,
    component: CamionFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.CAMION}/${a.CREAR}`,
    },
  },
  {
    path: `${a.EDITAR}/:id`,
    component: CamionFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.CAMION}/${a.EDITAR}`,
    },
  },
  {
    path: `${a.VER}/:id`,
    component: CamionFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.CAMION}/${a.VER}`,
    },
  },
];

export const semiUrls = [
  {
    path: a.LISTAR,
    component: SemiListComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.FLOTA}/${m.SEMIRREMOLQUE}/${a.LISTAR}`,
    },
  },
  {
    path: a.CREAR,
    component: SemiFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.SEMIRREMOLQUE}/${a.CREAR}`,
    },
  },
  {
    path: `${a.EDITAR}/:id`,
    component: SemiFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.SEMIRREMOLQUE}/${a.EDITAR}`,
    },
  },
  {
    path: `${a.VER}/:id`,
    component: SemiFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.SEMIRREMOLQUE}/${a.VER}`,
    },
  },
];


const routes: Routes = [
  {
    path: m.COMBINACION,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      ...combinacionUrls,
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
      ...propietarioUrls,
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
      ...choferUrls,
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
      ...camionUrls,
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
      ...semiUrls,
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlotaRoutingModule {}
