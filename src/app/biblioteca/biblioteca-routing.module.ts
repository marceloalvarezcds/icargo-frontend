import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  permisoModeloTitulo,
  PermisoModuloRouterEnum as u,
} from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { SeleccionableFormDialogComponent } from 'src/app/dialogs/seleccionable-form-dialog/seleccionable-form-dialog.component';
import { SeleccionableListComponent } from 'src/app/shared/seleccionable-list/seleccionable-list.component';
import { SeleccionableBaseModel } from 'src/app/interfaces/seleccionable';

const cargoData = {
  modelo: m.CARGO,
  submodule: permisoModeloTitulo[m.CARGO],
  changeStatusMsg: 'al Cargo',
  dialogComponent: SeleccionableFormDialogComponent,
  getDialogData: (item?: SeleccionableBaseModel) => ({
    item,
    modelo: m.CARGO,
    submodule: permisoModeloTitulo[m.CARGO],
  }),
};

export const cargoUrls = [
  {
    path: a.LISTAR,
    component: SeleccionableListComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.BIBLIOTECA}/${m.CARGO}/${a.LISTAR}`,
      ...cargoData,
    },
  },
];

const routes: Routes = [
  {
    path: m.CARGO,
    data: {
      ...cargoData,
    },
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      ...cargoUrls,
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BibliotecaRoutingModule {}
