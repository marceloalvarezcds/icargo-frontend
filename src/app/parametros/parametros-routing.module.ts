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
import { TipoMovimientoFormDialogComponent } from '../dialogs/tipo-movimiento-form-dialog/tipo-movimiento-form-dialog.component';
import { TipoMovimiento } from 'src/app/interfaces/tipo-movimiento';

const routes: Routes = [
  {
    path: m.TIPO_CUENTA,
    data: {
      modelo: m.TIPO_CUENTA,
      submodule: permisoModeloTitulo[m.TIPO_CUENTA],
      changeStatusMsg: 'a la Cuenta',
      dialogComponent: SeleccionableFormDialogComponent,
      getDialogData: (item?: SeleccionableBaseModel) => ({
        item,
        modelo: m.TIPO_CUENTA,
        submodule: permisoModeloTitulo[m.TIPO_CUENTA],
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
  {
    path: m.TIPO_MOVIMIENTO,
    data: {
      modelo: m.TIPO_MOVIMIENTO,
      submodule: permisoModeloTitulo[m.TIPO_MOVIMIENTO],
      changeStatusMsg: 'al Concepto',
      dialogComponent: TipoMovimientoFormDialogComponent,
      getDialogData: (item?: TipoMovimiento) => ({
        item,
        modelo: m.TIPO_MOVIMIENTO,
        submodule: permisoModeloTitulo[m.TIPO_MOVIMIENTO],
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
export class ParametrosRoutingModule {}
