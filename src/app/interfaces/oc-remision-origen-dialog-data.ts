import {
  mockOrdenCargaRemisionOrigenList,
  OrdenCargaRemisionOrigen,
} from './orden-carga-remision-origen';

export interface OcRemisionOrigenDialogData {
  item?: OrdenCargaRemisionOrigen;
  cantidad_disponible: number;
  orden_carga_id: number;
}

export const mockOcRemisionOrigenDialogData: OcRemisionOrigenDialogData = {
  item: mockOrdenCargaRemisionOrigenList[0],
  cantidad_disponible: 10000,
  orden_carga_id: 1,
};

export const mockOcRemisionOrigenDialogDataWithoutItem: OcRemisionOrigenDialogData =
  {
    cantidad_disponible: 1000,
    orden_carga_id: 1,
  };
