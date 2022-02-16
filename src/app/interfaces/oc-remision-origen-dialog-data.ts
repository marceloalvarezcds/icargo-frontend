import { mockOrdenCargaRemisionOrigenList, OrdenCargaRemisionOrigen } from './orden-carga-remision-origen';

export interface OcRemisionOrigenDialogData {
  item?: OrdenCargaRemisionOrigen,
  orden_carga_id: number,
}

export const mockOcRemisionOrigenDialogData: OcRemisionOrigenDialogData = {
  item: mockOrdenCargaRemisionOrigenList[0],
  orden_carga_id: 1,
}

export const mockOcRemisionOrigenDialogDataWithoutItem: OcRemisionOrigenDialogData = {
  orden_carga_id: 1,
}
