import { FacturaForm, mockFacturaForm1 } from './factura';

export interface FacturaFormDialogData {
  item?: FacturaForm;
  liquidacion_id: number;
  valor_operacion: number;
  ruc: string,
  contribuyente: string,
  tipo_contraparte_id: number;
  contraparte_id: number;
}

export const mockFacturaFormDialogData: FacturaFormDialogData = {
  item: mockFacturaForm1,
  liquidacion_id: 1,
  valor_operacion: 0,
  ruc: '123',
  contribuyente: 'contraparte',
  tipo_contraparte_id: 0,
  contraparte_id: 0,
};

export const mockFacturaFormDialogDataWithoutItem: FacturaFormDialogData = {
  liquidacion_id: 1,
  valor_operacion: 0,
  ruc: '123',
  contribuyente: 'contraparte',
  tipo_contraparte_id: 0,
  contraparte_id: 0,
};
