import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { SeleccionableFormComponent } from './seleccionable-form/seleccionable-form.component';
import { SeleccionableListComponent } from './seleccionable-list/seleccionable-list.component';

const routes: Routes = [
  {
    path: m.CARGO,
    data: {
      modelo: m.CARGO,
      submodule: 'Cargo',
      changeStatusMsg: 'al Cargo',
    },
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      {
        path: a.LISTAR,
        component: SeleccionableListComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: a.CREAR,
        component: SeleccionableFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.EDITAR}/:id`,
        component: SeleccionableFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.VER}/:id`,
        component: SeleccionableFormComponent,
        canActivate: [PermisoGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguracionesRoutingModule {}
