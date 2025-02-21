import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { InsumoListComponent } from './insumo-list/insumo-list.component';
import { InsumoVentaPrecioFormComponent } from './insumo-venta-precio-form/insumo-venta-precio-form.component';
import { CreateInsmunoVentaPrecioFormComponent } from './create-insmuno-venta-precio-form/create-insmuno-venta-precio-form.component';

const routes: Routes = [
  {
    path: m.INSUMO_PUNTO_VENTA_PRECIO,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      {
        path: a.LISTAR,
        component: InsumoListComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: a.CREAR,
        component: InsumoVentaPrecioFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.CREAR}/:mercaderias`,
        component: CreateInsmunoVentaPrecioFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.EDITAR}/:id`,
        component: InsumoVentaPrecioFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.VER}/:id`,
        component: InsumoVentaPrecioFormComponent,
        canActivate: [PermisoGuard],
      },

    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsumoRoutingModule { }
