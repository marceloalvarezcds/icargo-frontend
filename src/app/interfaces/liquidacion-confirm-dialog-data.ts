import { ContraparteInfo, mockContraparteInfoList } from './contraparte-info';
import { mockMovimientoList, Movimiento } from './movimiento';

export interface LiquidacionConfirmDialogData {
  contraparteInfo: ContraparteInfo;
  list: Movimiento[];
  credito: number;
  debito: number;
  monto: number;
  saldo: number;
}

export const mockLiquidacionConfirmDialogData: LiquidacionConfirmDialogData = {
  contraparteInfo: mockContraparteInfoList[0],
  list: mockMovimientoList,
  credito: 0,
  debito: 1000,
  monto:0,
  saldo: 0
};
