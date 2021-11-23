export interface GestorCargaPropietario {
  id?: number;
  propietario_id: number;
  gestor_carga_id: number;
  alias: string;
}

export const mockGestorCargaPropietario: GestorCargaPropietario = {
  id: 1,
  propietario_id: 1,
  gestor_carga_id: 1,
  alias: 'Alias 1',
};

export const mockGestorCargaPropietarioList: GestorCargaPropietario[] = [
  {
    id: 1,
    propietario_id: 1,
    gestor_carga_id: 1,
    alias: 'Alias 1',
  },
  {
    id: 2,
    propietario_id: 2,
    gestor_carga_id: 1,
    alias: 'Alias 2',
  },
  {
    id: 3,
    propietario_id: 3,
    gestor_carga_id: 1,
    alias: 'Alias 3',
  },
];
