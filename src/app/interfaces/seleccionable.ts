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
