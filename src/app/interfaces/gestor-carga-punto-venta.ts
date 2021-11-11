export interface GestorCargaPuntoVenta {
  id?: number;
  punto_venta_id: number;
  gestor_carga_id: number;
  alias: string;
}

export const mockGestorCargaPuntoVenta: GestorCargaPuntoVenta = {
  id: 1,
  punto_venta_id: 1,
  gestor_carga_id: 1,
  alias: 'Alias 1',
};

export const mockGestorCargaPuntoVentaList: GestorCargaPuntoVenta[] = [
  {
    id: 1,
    punto_venta_id: 1,
    gestor_carga_id: 1,
    alias: 'Alias 1',
  },
  {
    id: 2,
    punto_venta_id: 2,
    gestor_carga_id: 1,
    alias: 'Alias 2',
  },
  {
    id: 3,
    punto_venta_id: 3,
    gestor_carga_id: 1,
    alias: 'Alias 3',
  },
];
