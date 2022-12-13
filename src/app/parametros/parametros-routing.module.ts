import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  permisoModeloTitulo,
  PermisoModuloRouterEnum as u,
} from 'src/app/enums/permiso-enum';
import { PermisoGuard } from 'src/app/guards/permiso.guard';
import { TipoMovimiento } from 'src/app/interfaces/tipo-movimiento';
import { SeleccionableListComponent } from 'src/app/shared/seleccionable-list/seleccionable-list.component';
import { TipoCuentaFormDialogComponent } from 'src/app/dialogs/tipo-cuenta-form-dialog/tipo-cuenta-form-dialog.component';
import { TipoMovimientoFormDialogComponent } from 'src/app/dialogs/tipo-movimiento-form-dialog/tipo-movimiento-form-dialog.component';
import { TipoCuenta } from 'src/app/interfaces/tipo-cuenta';

const tipoCuenta = {
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
};

const tipoMovimientoData = {
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
};

export const tipoCuentaUrls = [
  {
    path: a.LISTAR,
    component: SeleccionableListComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.PARAMETROS}/${m.TIPO_CUENTA}/${a.LISTAR}`,
      ...tipoCuenta,
    },
  },
];

export const tipoMovimientoUrls = [
  {
    path: a.LISTAR,
    component: SeleccionableListComponent,
    canActivate: [PermisoGuard],
    data: {
      url: `/${u.PARAMETROS}/${m.TIPO_MOVIMIENTO}/${a.LISTAR}`,
      ...tipoMovimientoData,
    },
  },
];

const routes: Routes = [
  {
    path: m.TIPO_CUENTA,
    data: {
      ...tipoCuenta,
    },
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      ...tipoCuentaUrls,
    ],
  },
  {
    path: m.TIPO_MOVIMIENTO,
    data: {
      ...tipoMovimientoData,
    },
    children: [
      {
        path: '',
        redirectTo: a.LISTAR,
        pathMatch: 'full',
      },
      ...tipoMovimientoUrls,
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParametrosRoutingModule {}
