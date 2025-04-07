import {
  InstrumentoLiquidacionItem,
  mockInstrumentoLiquidacionItem,
} from './instrumento';

export interface InstrumentoFormDialogData {
  item?: InstrumentoLiquidacionItem;
  es_cobro: boolean;
  residuo?: number;
  isShow?:boolean;
  totalMonedas:any;
}

export const mockInstrumentoFormDialogData: InstrumentoFormDialogData = {
  item: mockInstrumentoLiquidacionItem,
  es_cobro: true,
  residuo: 0,
  totalMonedas:[]
};

export const mockInstrumentoFormDialogDataWithoutItem: InstrumentoFormDialogData =
  {
    es_cobro: false,
    residuo: 0,
    totalMonedas:[]
  };
