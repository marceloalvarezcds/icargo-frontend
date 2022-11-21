import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  permisoModeloTitulo,
} from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { TipoMovimiento } from 'src/app/interfaces/tipo-movimiento';
import { SeleccionableListComponent } from 'src/app/shared/seleccionable-list/seleccionable-list.component';
import { TipoCuentaFormDialogComponent } from '../dialogs/tipo-cuenta-form-dialog/tipo-cuenta-form-dialog.component';
import { TipoMovimientoFormDialogComponent } from '../dialogs/tipo-movimiento-form-dialog/tipo-movimiento-form-dialog.component';
import { TipoCuenta } from '../interfaces/tipo-cuenta';

const routes: Routes = [
  {
    path: m.TIPO_CUENTA,
    data: {
      modelo: m.TIPO_CUENTA,
      submodule: permisoModeloTitulo[m.TIPO_CUENTA],
      changeStatusMsg: 'a la Cuenta',
      dialogComponent: TipoCuentaFormDialogComponent,
      getDialogData: (item?: TipoCuenta) => ({
        item,
        modelo: m.TIPO_CUENTA,
        submodule: permisoModeloTitulo[m.TIPO_CUENTA],
      }),
      additionalColumns: [
        {
          def: 'codigo',
          title: 'Código',
          value: (element: TipoCuenta) => element.codigo,
        },
      ],
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
      additionalColumns: [
        {
          def: 'cuenta_codigo_descripcion',
          title: 'Cuenta',
          value: (element: TipoMovimiento) => element.cuenta_codigo_descripcion,
        },
        {
          def: 'codigo',
          title: 'Código',
          value: (element: TipoMovimiento) => element.codigo,
        },
      ],
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
