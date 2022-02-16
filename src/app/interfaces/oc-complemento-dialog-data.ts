import { mockOrdenCargaComplementoList, OrdenCargaComplemento } from './orden-carga-complemento';

export interface OcComplementoDialogData {
  item?: OrdenCargaComplemento,
  orden_carga_id: number,
}

export const mockOcComplementoDialogData: OcComplementoDialogData = {
  item: mockOrdenCargaComplementoList[0],
  orden_carga_id: 1,
}

export const mockOcComplementoDialogDataWithoutItem: OcComplementoDialogData = {
  orden_carga_id: 1,
}
