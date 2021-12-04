import { EstadoEnum } from 'src/app/enums/estado-enum';

export interface EnteEmisorTransporte {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockEnteEmisorTransporteList: EnteEmisorTransporte[] = [
  {
    id: 1,
    descripcion: 'Dirección Nacional de Transporte. DINATRAN',
    estado: EstadoEnum.ACTIVO,
  },
];
