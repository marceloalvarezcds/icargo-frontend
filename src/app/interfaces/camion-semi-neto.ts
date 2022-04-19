import { EstadoEnum } from 'src/app/enums/estado-enum';

export interface CamionSemiNetoForm {
  camion_id: number;
  semi_id: number;
  producto_id?: number | null;
  neto: number;
}

export interface CamionSemiNeto extends CamionSemiNetoForm {
  id: number;
  camion_info: string;
  camion_placa: string;
  semi_info: string;
  semi_placa: string;
  producto_descripcion?: string | null;
  gestor_carga_id: number;
  gestor_carga_nombre: string;
  estado: EstadoEnum;
  // Auditoría
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}

export const mockCamionSemiNetoList: CamionSemiNeto[] = [
  {
    camion_id: 5,
    semi_id: 3,
    producto_id: null,
    neto: 45253,
    id: 12,
    camion_info: '1p-200200',
    camion_placa: '1p-200200',
    semi_info: '1800100100',
    semi_placa: '1800100100',
    producto_descripcion: null,
    gestor_carga_id: 1,
    gestor_carga_nombre: 'Transred',
    estado: EstadoEnum.ACTIVO,
    created_by: 'system',
    created_at: '2022-04-12T22:35:11.755717',
    modified_by: 'system',
    modified_at: '2022-04-12T22:35:11.755717',
  },
];

export const mockCamionSemiNeto = mockCamionSemiNetoList[0];
