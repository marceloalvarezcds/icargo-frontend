import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { OrdenCargaAnticiposListComponent } from './orden-carga-anticipos-list/orden-carga-anticipos-list.component';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { OrdenCargaAnticiposFormComponent } from './orden-carga-anticipos-form/orden-carga-anticipos-form.component';
import { OrdenCargaAnticiposEditFormComponent } from './orden-carga-anticipos-edit-form/orden-carga-anticipos-edit-form.component';

const routes: Routes = [
  {
    path: m.ORDEN_CARGA_ANTICIPO_RETIRADO,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      {
        path: a.LISTAR,
        component: OrdenCargaAnticiposListComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: a.CREAR,
        component: OrdenCargaAnticiposFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.EDITAR}/:id`,
        component: OrdenCargaAnticiposEditFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.VER}/:id`,
        component: OrdenCargaAnticiposEditFormComponent,
        canActivate: [PermisoGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdenCargaAnticiposRoutingModule { }
