import { AfectadoEnum } from 'src/app/enums/afectado-enum';
import { mockMovimientoList, Movimiento } from './movimiento';

export interface MovimientoMermaEditFormDialogData {
  item: Movimiento;
  afectado: AfectadoEnum;
}

export const mockMovimientoMermaEditFormDialogData: MovimientoMermaEditFormDialogData =
  {
    item: mockMovimientoList[0],
    afectado: AfectadoEnum.PROPIETARIO,
  };
