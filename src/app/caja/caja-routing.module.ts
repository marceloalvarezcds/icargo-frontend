import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { CajaFormComponent } from './caja-form/caja-form.component';
import { CajaListComponent } from './caja-list/caja-list.component';
import { CajaFormInstrumentosComponent } from './caja-form-instrumentos/caja-form-instrumentos.component';

const routes: Routes = [
  {
    path: m.CAJA,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      {
        path: a.LISTAR,
        component: CajaListComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: a.CREAR,
        component: CajaFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.EDITAR}/:id`,
        component: CajaFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.VER}/:id`,
        component: CajaFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: m.MOVIMIENTO,
        children: [
          {
            path: `${a.VER}/:id`,
            component: CajaFormInstrumentosComponent,
            canActivate: [PermisoGuard],
          },
        ]
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CajaRoutingModule {}
