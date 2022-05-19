import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { FleteFormComponent } from './flete-form/flete-form.component';
import { FleteListComponent } from './flete-list/flete-list.component';

const routes: Routes = [
  {
    path: m.FLETE,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      {
        path: a.LISTAR,
        component: FleteListComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: a.CREAR,
        component: FleteFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.EDITAR}/:id`,
        component: FleteFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.VER}/:id`,
        component: FleteFormComponent,
        canActivate: [PermisoGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FleteRoutingModule {}
