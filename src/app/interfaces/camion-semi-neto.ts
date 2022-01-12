import { EstadoEnum } from 'src/app/enums/estado-enum';

export interface CamionSemiNetoForm {
  camion_id: number;
  semi_id: number;
  producto_id?: number | null;
  neto: number;
}

export interface CamionSemiNeto extends CamionSemiNetoForm {
  id: number;
  camion_placa: string;
  semi_placa: string;
  producto_descripcion?: string | null;
  gestor_cuenta_id: number;
  gestor_cuenta_nombre: string;
  estado: EstadoEnum;
  // Auditoría
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}
