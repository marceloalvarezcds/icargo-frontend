import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { BancoFormComponent } from './banco-form/banco-form.component';
import { BancoListComponent } from './banco-list/banco-list.component';
import { BancoFormInstrumentosComponent } from './banco-form-instrumentos/banco-form-instrumentos.component';

const routes: Routes = [
  {
    path: m.BANCO,
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      {
        path: a.LISTAR,
        component: BancoListComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: a.CREAR,
        component: BancoFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.EDITAR}/:id`,
        component: BancoFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: `${a.VER}/:id`,
        component: BancoFormComponent,
        canActivate: [PermisoGuard],
      },
      {
        path: m.MOVIMIENTO,
        children: [
          {
            path: `${a.LISTAR}/:id`,
            component: BancoFormInstrumentosComponent,
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
export class BancoRoutingModule {}
