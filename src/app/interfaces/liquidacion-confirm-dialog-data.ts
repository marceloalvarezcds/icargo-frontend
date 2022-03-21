import { EstadoCuenta, mockEstadoCuentaList } from './estado-cuenta';
import { mockMovimientoList, Movimiento } from './movimiento';

export interface LiquidacionConfirmDialogData {
  estadoCuenta: EstadoCuenta;
  list: Movimiento[];
  credito: number;
  debito: number;
}

export const mockLiquidacionConfirmDialogData: LiquidacionConfirmDialogData = {
  estadoCuenta: mockEstadoCuentaList[0],
  list: mockMovimientoList,
  credito: 0,
  debito: 1000,
};
