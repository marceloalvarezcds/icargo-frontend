import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { MonedaCotizacionListComponent } from './moneda-cotizacion-list/moneda-cotizacion-list.component';
import { MonedaCotizacionFormComponent } from './moneda-cotizacion-form/moneda-cotizacion-form.component';

const routes: Routes = [
     {
        path: m.MONEDA_COTIZACION,
        children: [
          {
            path: '',
            redirectTo: a.LISTAR,
            pathMatch: 'full',
          },
          {
            path: a.LISTAR,
            component: MonedaCotizacionListComponent,
            canActivate: [PermisoGuard],
          },
          {
            path: `${a.CREAR}`,
            component: MonedaCotizacionFormComponent,
            canActivate: [PermisoGuard],
            },
          {
            path: `${a.EDITAR}/:id`,
            component: MonedaCotizacionFormComponent,
            canActivate: [PermisoGuard],
          },

          {
            path: `${a.VER}/:id`,
            component: MonedaCotizacionFormComponent,
            canActivate: [PermisoGuard],
          },
        ],
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonedaCotizacionRoutingModule { }
