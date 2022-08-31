import { AfectadoEnum } from 'src/app/enums/afectado-enum';
import { Movimiento, mockMovimientoList } from './movimiento';

export interface MovimientoFleteEditFormDialogData {
  item: Movimiento;
  afectado: AfectadoEnum;
}

export const mockMovimientoFleteEditFormDialogData: MovimientoFleteEditFormDialogData =
  {
    item: mockMovimientoList[0],
    afectado: AfectadoEnum.PROPIETARIO,
  };
