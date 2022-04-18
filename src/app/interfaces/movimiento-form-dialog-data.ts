import { MovimientoEstadoEnum } from 'src/app/enums/movimiento-estado-enum';
import { MovimientoForm, mockMovimientoForm1 } from './movimiento';

export interface MovimientoFormDialogData {
  item?: MovimientoForm;
  liquidacion_id: number | null;
  tipo_contraparte_id: number | null;
  contraparte: string | null;
  contraparte_numero_documento: string | null;
  estado: MovimientoEstadoEnum;
}

export const mockMovimientoFormDialogData: MovimientoFormDialogData = {
  item: mockMovimientoForm1,
  liquidacion_id: null,
  tipo_contraparte_id: null,
  contraparte: null,
  contraparte_numero_documento: null,
  estado: MovimientoEstadoEnum.PENDIENTE,
};

export const mockMovimientoFormDialogDataWithoutItem: MovimientoFormDialogData =
  {
    liquidacion_id: 1,
    tipo_contraparte_id: 1,
    contraparte: '1',
    contraparte_numero_documento: '1',
    estado: MovimientoEstadoEnum.EN_PROCESO,
  };
