import { mockOrdenCargaRemisionDestinoList, OrdenCargaRemisionDestino } from './orden-carga-remision-destino';

export interface OcRemisionDestinoDialogData {
  item?: OrdenCargaRemisionDestino,
  orden_carga_id: number,
  cantidad_destino: number,
  cantidad_origen: number,
}

export const mockOcRemisionDestinoDialogData: OcRemisionDestinoDialogData = {
  item: mockOrdenCargaRemisionDestinoList[0],
  orden_carga_id: 1,
  cantidad_destino: 10000,
  cantidad_origen: 12000,
}

export const mockOcRemisionDestinoDialogDataWithoutItem: OcRemisionDestinoDialogData = {
  orden_carga_id: 1,
  cantidad_destino: 10000,
  cantidad_origen: 12000,
}
