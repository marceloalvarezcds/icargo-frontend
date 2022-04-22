import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { RentabilidadListComponent } from './rentabilidad-list/rentabilidad-list.component';

const routes: Routes = [
  {
    path: m.RENTABILIDAD,
    children: [
      {
        path: a.LISTAR,
        component: RentabilidadListComponent,
        canActivate: [PermisoGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListadoRoutingModule {}
