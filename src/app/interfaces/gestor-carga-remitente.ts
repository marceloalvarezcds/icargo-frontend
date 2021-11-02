export interface GestorCargaRemitente {
  id?: number;
  remitente_id: number;
  gestor_carga_id: number;
  alias: string;
}

export const mockGestorCargaRemitente: GestorCargaRemitente = {
  id: 1,
  remitente_id: 1,
  gestor_carga_id: 1,
  alias: 'Alias 1',
};

export const mockGestorCargaRemitenteList: GestorCargaRemitente[] = [
  {
    id: 1,
    remitente_id: 1,
    gestor_carga_id: 1,
    alias: 'Alias 1',
  },
  {
    id: 2,
    remitente_id: 2,
    gestor_carga_id: 1,
    alias: 'Alias 2',
  },
  {
    id: 3,
    remitente_id: 3,
    gestor_carga_id: 1,
    alias: 'Alias 3',
  },
];
