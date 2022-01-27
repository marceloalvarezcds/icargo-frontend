import { mockOrdenCargaAnticipoRetiradoList, OrdenCargaAnticipoRetirado } from './orden-carga-anticipo-retirado';

export interface OcAnticipoRetiradoDialogData {
  item?: OrdenCargaAnticipoRetirado,
  orden_carga_id: number,
  flete_id: number,
}

export const mockOcAnticipoRetiradoDialogData: OcAnticipoRetiradoDialogData = {
  item: mockOrdenCargaAnticipoRetiradoList[0],
  orden_carga_id: 1,
  flete_id: 1,
}

export const mockOcAnticipoRetiradoDialogDataWithoutItem: OcAnticipoRetiradoDialogData = {
  orden_carga_id: 1,
  flete_id: 1,
}
