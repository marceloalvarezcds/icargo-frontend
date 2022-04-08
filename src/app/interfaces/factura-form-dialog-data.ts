import { FacturaForm, mockFacturaForm1 } from './factura';

export interface FacturaFormDialogData {
  item?: FacturaForm;
  liquidacion_id: number;
  valor_operacion: number;
}

export const mockFacturaFormDialogData: FacturaFormDialogData = {
  item: mockFacturaForm1,
  liquidacion_id: 1,
  valor_operacion: 0,
};

export const mockFacturaFormDialogDataWithoutItem: FacturaFormDialogData = {
  liquidacion_id: 1,
  valor_operacion: 0,
};
