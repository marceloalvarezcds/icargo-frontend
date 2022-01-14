import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermisoAccionEnum as a, PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { OrdenCargaCreateFormComponent } from './orden-carga-create-form/orden-carga-create-form.component';
import { OrdenCargaEditFormComponent } from './orden-carga-edit-form/orden-carga-edit-form.component';
import { OrdenCargaListComponent } from './orden-carga-list/orden-carga-list.component';

const routes: Routes = [
  {
    path: m.ORDEN_CARGA,
    children: [
      {
        path: a.LISTAR,
        component: OrdenCargaListComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: a.CREAR,
        component: OrdenCargaCreateFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.EDITAR}/:id`,
        component: OrdenCargaEditFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.VER}/:id`,
        component: OrdenCargaEditFormComponent,
        canActivate: [PermisoGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdenCargaRoutingModule { }
