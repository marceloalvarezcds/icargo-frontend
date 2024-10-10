import { MovimientoEstadoEnum } from 'src/app/enums/movimiento-estado-enum';
import { MovimientoForm, mockMovimientoForm1 } from './movimiento';

export interface MovimientoFormDialogData {
  item?: MovimientoForm;
  liquidacion_id?: number | null;
  contraparte_id?:number | null;
  tipo_contraparte_id?: number | null;
  tipo_contraparte_descripcion?: string | null;
  contraparte?: string | null;
  contraparte_numero_documento?: string | null;
  estado: MovimientoEstadoEnum;
  es_contraparte_editable: boolean;
}

export const mockMovimientoFormDialogData: MovimientoFormDialogData = {
  item: mockMovimientoForm1,
  liquidacion_id: 1,
  tipo_contraparte_id: 1,
  contraparte: null,
  contraparte_numero_documento: null,
  estado: MovimientoEstadoEnum.PENDIENTE,
  es_contraparte_editable: true,
};

export const mockMovimientoFormDialogDataWithoutItem: MovimientoFormDialogData =
  {
    liquidacion_id: 1,
    tipo_contraparte_id: 1,
    contraparte: '1',
    contraparte_numero_documento: '1',
    estado: MovimientoEstadoEnum.EN_PROCESO,
    es_contraparte_editable: false,
  };
