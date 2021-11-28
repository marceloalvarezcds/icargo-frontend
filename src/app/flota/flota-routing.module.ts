import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermisoAccionEnum as a, PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { ChoferFormComponent } from './chofer-form/chofer-form.component';
import { ChoferListComponent } from './chofer-list/chofer-list.component';
import { PropietarioFormComponent } from './propietario-form/propietario-form.component';
import { PropietarioListComponent } from './propietario-list/propietario-list.component';

const routes: Routes = [
  {
    path: m.PROPIETARIO,
    children: [
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlotaRoutingModule { }
