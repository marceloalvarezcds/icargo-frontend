export interface GestorCargaProveedor {
  id?: number;
  proveedor_id: number;
  gestor_carga_id: number;
  alias: string;
}

export const mockGestorCargaProveedor: GestorCargaProveedor = {
  id: 1,
  proveedor_id: 1,
  gestor_carga_id: 1,
  alias: 'Alias 1',
};

export const mockGestorCargaProveedorList: GestorCargaProveedor[] = [
  {
    id: 1,
    proveedor_id: 1,
    gestor_carga_id: 1,
    alias: 'Alias 1',
  },
  {
    id: 2,
    proveedor_id: 2,
    gestor_carga_id: 1,
    alias: 'Alias 2',
  },
  {
    id: 3,
    proveedor_id: 3,
    gestor_carga_id: 1,
    alias: 'Alias 3',
  },
];
