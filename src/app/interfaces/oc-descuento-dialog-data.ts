import { OrdenCarga } from './orden-carga';
import { mockOrdenCargaDescuentoList, OrdenCargaDescuento } from './orden-carga-descuento';

export interface OcDescuentoDialogData {
  item?: OrdenCargaDescuento,
  orden_carga_id: number,
  oc?: OrdenCarga | null;
}

export const mockOcDescuentoDialogData: OcDescuentoDialogData = {
  item: mockOrdenCargaDescuentoList[0],
  orden_carga_id: 1,
}

export const mockOcDescuentoDialogDataWithoutItem: OcDescuentoDialogData = {
  orden_carga_id: 1,
}
