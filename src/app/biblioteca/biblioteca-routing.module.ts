import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  permisoModeloTitulo,
} from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { SeleccionableFormDialogComponent } from 'src/app/dialogs/seleccionable-form-dialog/seleccionable-form-dialog.component';
import { SeleccionableListComponent } from 'src/app/shared/seleccionable-list/seleccionable-list.component';
import { SeleccionableBaseModel } from 'src/app/interfaces/seleccionable';

const routes: Routes = [
  {
    path: m.CARGO,
    data: {
      modelo: m.CARGO,
      submodule: permisoModeloTitulo[m.CARGO],
      changeStatusMsg: 'al Cargo',
      dialogComponent: SeleccionableFormDialogComponent,
      getDialogData: (item?: SeleccionableBaseModel) => ({
        item,
        modelo: m.CARGO,
        submodule: permisoModeloTitulo[m.CARGO],
      }),
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BibliotecaRoutingModule {}
