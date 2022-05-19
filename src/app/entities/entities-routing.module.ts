import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
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

const routes: Routes = [
  {
    path: m.CENTRO_OPERATIVO,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      {
        path: a.LISTAR,
        component: CentrosOperativosListComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: a.CREAR,
        component: CentrosOperativosFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.EDITAR}/:id`,
        component: CentrosOperativosFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.VER}/:id`,
        component: CentrosOperativosFormComponent,
        canActivate: [PermisoGuard],
      },
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
      {
        path: a.LISTAR,
        component: GestorCargaListComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: a.CREAR,
        component: GestorCargaFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.EDITAR}/:id`,
        component: GestorCargaFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.VER}/:id`,
        component: GestorCargaFormComponent,
        canActivate: [PermisoGuard],
      },
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
      {
        path: a.LISTAR,
        component: ProveedorListComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: a.CREAR,
        component: ProveedorFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.EDITAR}/:id`,
        component: ProveedorFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.VER}/:id`,
        component: ProveedorFormComponent,
        canActivate: [PermisoGuard],
      },
    ],
  },
  {
    path: m.PUNTO_VENTA,
    children: [
      {
        path: `${a.CREAR}/:proveedorId`,
        component: PuntoVentaFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.EDITAR}/:proveedorId/:id`,
        component: PuntoVentaFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.VER}/:proveedorId/:id`,
        component: PuntoVentaFormComponent,
        canActivate: [PermisoGuard],
      },
    ],
  },
  {
    path: m.REMITENTE,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      {
        path: a.LISTAR,
        component: RemitenteListComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: a.CREAR,
        component: RemitenteFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.EDITAR}/:id`,
        component: RemitenteFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.VER}/:id`,
        component: RemitenteFormComponent,
        canActivate: [PermisoGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntitiesRoutingModule {}
