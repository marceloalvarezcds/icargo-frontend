export interface GestorCargaCentroOperativo {
  id?: number;
  centro_operativo_id: number;
  gestor_carga_id: number;
  alias: string;
}

export const mockGestorCargaCentroOperativo: GestorCargaCentroOperativo = {
  id: 1,
  centro_operativo_id: 1,
  gestor_carga_id: 1,
  alias: 'Alias 1',
};

export const mockGestorCargaCentroOperativoList: GestorCargaCentroOperativo[] = [
  {
    id: 1,
    centro_operativo_id: 1,
    gestor_carga_id: 1,
    alias: 'Alias 1',
  },
  {
    id: 2,
    centro_operativo_id: 2,
    gestor_carga_id: 1,
    alias: 'Alias 2',
  },
  {
    id: 3,
    centro_operativo_id: 3,
    gestor_carga_id: 1,
    alias: 'Alias 3',
  },
];
