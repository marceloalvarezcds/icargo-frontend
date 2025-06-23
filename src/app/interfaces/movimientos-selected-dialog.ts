import { ContraparteInfo, ContraparteInfoMovimientoLiq, mockContraparteInfoList } from './contraparte-info';
import { mockMovimientoList, Movimiento } from './movimiento';

export interface MovimientosSelectedDialogData {
  contraparteInfo: ContraparteInfo;
  list: Movimiento[];
  saldo: number;
  punto_venta_id?: number;
  moneda?: string;
  sentido?: string;
}

/*
export const mockMovimientosSelectedDialogData: MovimientosSelectedDialogData =
  {
    contraparteInfo: ContraparteInfoMovimientoLiq,
    list: mockMovimientoList,
    saldo: 0,
  };
*/
