import { ContraparteInfo, mockContraparteInfoList } from './contraparte-info';
import { mockMovimientoList, Movimiento } from './movimiento';

export interface MovimientosSelectedDialogData {
  contraparteInfo: ContraparteInfo;
  list: Movimiento[];
  saldo: number;
  punto_venta_id?: number;
}

export const mockMovimientosSelectedDialogData: MovimientosSelectedDialogData =
  {
    contraparteInfo: mockContraparteInfoList[0],
    list: mockMovimientoList,
    saldo: 0,
  };
