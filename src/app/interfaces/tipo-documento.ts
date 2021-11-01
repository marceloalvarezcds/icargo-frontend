import { EstadoEnum } from '../enums/estado-enum';

export interface TipoDocumento {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockTipoDocumentoList: TipoDocumento[] = [
  {
    id: 1,
    descripcion: 'RUC',
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: 'Cédula',
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 3,
    descripcion: 'Pasaporte',
    estado: EstadoEnum.ACTIVO,
  },
];
