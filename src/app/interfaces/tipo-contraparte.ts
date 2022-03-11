import { EstadoEnum } from 'src/app/enums/estado-enum';

export interface TipoContraparte {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockTipoContraparteList: TipoContraparte[] = [
  {
    id: 1,
    descripcion: 'Chofer',
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: 'Propietario',
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 3,
    descripcion: 'Proveedor',
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 4,
    descripcion: 'Remitente',
    estado: EstadoEnum.ACTIVO,
  },
];
