import { AnticiposPorOrdenCarga, OrdenCarga } from './orden-carga';
import { mockOrdenCargaAnticipoRetiradoList, OrdenCargaAnticipoRetirado } from './orden-carga-anticipo-retirado';

export interface OcAnticipoRetiradoDialogData {
  item?: OrdenCargaAnticipoRetirado,
  orden_carga_id: number,
  flete_id: number,
  oc?: OrdenCarga | null;
  anticipos?: AnticiposPorOrdenCarga[];
}

export interface OcAnticipoRetiradoTestDialogData {
  item?: OrdenCargaAnticipoRetirado,
  orden_carga_id: number,
  flete_id: number,
  moneda_id?: number,
  oc?: OrdenCarga | null;
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

