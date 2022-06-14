import { EstadoEnum } from 'src/app/enums/estado-enum';

interface EstadoBaseModel {
  estado: EstadoEnum;
}

export interface SeleccionableFormBaseModel {
  descripcion: string;
}

export interface SeleccionableBaseModel
  extends EstadoBaseModel,
    SeleccionableFormBaseModel {
  id: number;
  // Auditoría
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}

export const mockSeleccionableFormBaseModel1: SeleccionableFormBaseModel = {
  descripcion: 'Gerente',
};

export const mockSeleccionableBaseModel1: SeleccionableBaseModel = {
  id: 1,
  descripcion: 'Gerente',
  estado: EstadoEnum.ACTIVO,
  created_by: 'System',
  created_at: '2022-03-03T19:38:55.907002',
  modified_by: 'System',
  modified_at: '2022-03-03T19:38:55.907002',
};

export const mockSeleccionableFormBaseModel2: SeleccionableFormBaseModel = {
  descripcion: 'Vendedor',
};

export const mockSeleccionableBaseModel2: SeleccionableBaseModel = {
  id: 2,
  descripcion: 'Vendedor',
  estado: EstadoEnum.ACTIVO,
  created_by: 'System',
  created_at: '2022-03-03T19:38:55.907002',
  modified_by: 'System',
  modified_at: '2022-03-03T19:38:55.907002',
};

export const mockSeleccionableBaseModelList: SeleccionableBaseModel[] = [
  mockSeleccionableBaseModel1,
  mockSeleccionableBaseModel2,
];
