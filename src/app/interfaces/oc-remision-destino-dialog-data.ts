import {
  mockOrdenCargaRemisionDestinoList,
  OrdenCargaRemisionDestino,
} from './orden-carga-remision-destino';

export interface OcRemisionDestinoDialogData {
  item?: OrdenCargaRemisionDestino;
  cantidad_disponible: number;
  orden_carga_id: number;
}

export interface OrdenCargaRemisionDestinoResponse {
  warning?: string;
  data: any;
}


export const mockOcRemisionDestinoDialogData: OcRemisionDestinoDialogData = {
  item: mockOrdenCargaRemisionDestinoList[0],
  cantidad_disponible: 10000,
  orden_carga_id: 1,
};

export const mockOcRemisionDestinoDialogDataWithoutItem: OcRemisionDestinoDialogData =
  {
    cantidad_disponible: 10000,
    orden_carga_id: 1,
  };
