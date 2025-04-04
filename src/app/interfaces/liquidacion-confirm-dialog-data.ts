import { ContraparteGralInfo, mockContraparteInfoList } from './contraparte-info';
import { mockMovimientoList, Movimiento } from './movimiento';

export interface LiquidacionConfirmDialogData {
  contraparteInfo: ContraparteGralInfo;
  totalMonedas: any[];
  list: Movimiento[];
  credito: number;
  debito: number;
  monto: number;
  saldo: number;
  esOrdenPago?:boolean;
}

export const mockLiquidacionConfirmDialogData: LiquidacionConfirmDialogData = {
  contraparteInfo: mockContraparteInfoList[0],
  totalMonedas: [],
  list: mockMovimientoList,
  credito: 0,
  debito: 1000,
  monto:0,
  saldo: 0
};
