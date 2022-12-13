import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as u,
} from 'src/app/enums/permiso-enum';
import { CentrosOperativosFormComponent } from './centros-operativos-form/centros-operativos-form.component';
import { CentrosOperativosListComponent } from './centros-operativos-list/centros-operativos-list.component';
import { GestorCargaFormComponent } from './gestor-carga-form/gestor-carga-form.component';
import { GestorCargaListComponent } from './gestor-carga-list/gestor-carga-list.component';
import { ProveedorFormComponent } from './proveedor-form/proveedor-form.component';
import { ProveedorListComponent } from './proveedor-list/proveedor-list.component';
import { PuntoVentaFormComponent } from './punto-venta-form/punto-venta-form.component';
import { RemitenteFormComponent } from './remitente-form/remitente-form.component';
import { RemitenteListComponent } from './remitente-list/remitente-list.component';

export const centroOperativoUrls = [
  {
    path: a.LISTAR,
    component: CentrosOperativosListComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.CENTRO_OPERATIVO}/${a.LISTAR}`,
    },
  },
  {
    path: a.CREAR,
    component: CentrosOperativosFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.CENTRO_OPERATIVO}/${a.CREAR}`,
    },
  },
  {
    path: `${a.EDITAR}/:id`,
    component: CentrosOperativosFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.CENTRO_OPERATIVO}/${a.EDITAR}`,
    },
  },
  {
    path: `${a.VER}/:id`,
    component: CentrosOperativosFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.CENTRO_OPERATIVO}/${a.VER}`,
    },
  },
];

export const gestorCargaUrls = [
  {
    path: a.LISTAR,
    component: GestorCargaListComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.GESTOR_CARGA}/${a.LISTAR}`,
    },
  },
  {
    path: a.CREAR,
    component: GestorCargaFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.GESTOR_CARGA}/${a.CREAR}`,
    },
  },
  {
    path: `${a.EDITAR}/:id`,
    component: GestorCargaFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.GESTOR_CARGA}/${a.EDITAR}`,
    },
  },
  {
    path: `${a.VER}/:id`,
    component: GestorCargaFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.GESTOR_CARGA}/${a.VER}`,
    },
  },
];

export const proveedorUrls = [
  {
    path: a.LISTAR,
    component: ProveedorListComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.PROVEEDOR}/${a.LISTAR}`,
    },
  },
  {
    path: a.CREAR,
    component: ProveedorFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.PROVEEDOR}/${a.CREAR}`,
    },
  },
  {
    path: `${a.EDITAR}/:id`,
    component: ProveedorFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.PROVEEDOR}/${a.EDITAR}`,
    },
  },
  {
    path: `${a.VER}/:id`,
    component: ProveedorFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.PROVEEDOR}/${a.VER}`,
    },
  },
];

export const puntoVentaUrls = [
  {
    path: `${a.CREAR}/:proveedorId`,
    component: PuntoVentaFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.PUNTO_VENTA}/${a.CREAR}`,
      menuPath: `/${u.ENTITIES}/${m.PROVEEDOR}`,
    },
  },
  {
    path: `${a.EDITAR}/:proveedorId/:id`,
    component: PuntoVentaFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.PUNTO_VENTA}/${a.EDITAR}`,
      menuPath: `/${u.ENTITIES}/${m.PROVEEDOR}`,
    },
  },
  {
    path: `${a.VER}/:proveedorId/:id`,
    component: PuntoVentaFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.PUNTO_VENTA}/${a.VER}`,
      menuPath: `/${u.ENTITIES}/${m.PROVEEDOR}`,
    },
  },
];

export const remitenteUrls = [
  {
    path: a.LISTAR,
    component: RemitenteListComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.REMITENTE}/${a.LISTAR}`,
    },
  },
  {
    path: a.CREAR,
    component: RemitenteFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.REMITENTE}/${a.CREAR}`,
    },
  },
  {
    path: `${a.EDITAR}/:id`,
    component: RemitenteFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.REMITENTE}/${a.EDITAR}`,
    },
  },
  {
    path: `${a.VER}/:id`,
    component: RemitenteFormComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.ENTITIES}/${m.REMITENTE}/${a.VER}`,
    },
  },
];

const routes: Routes = [
  {
    path: m.CENTRO_OPERATIVO,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      ...centroOperativoUrls,
    ],
  },
  {
    path: m.GESTOR_CARGA,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      ...gestorCargaUrls,
    ],
  },
  {
    path: m.PROVEEDOR,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      ...proveedorUrls,
    ],
  },
  {
    path: m.PUNTO_VENTA,
    children: [...puntoVentaUrls],
  },
  {
    path: m.REMITENTE,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      ...remitenteUrls,
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntitiesRoutingModule {}
