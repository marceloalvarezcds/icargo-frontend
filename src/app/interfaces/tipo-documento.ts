import { EstadoEnum } from '../enums/estado-enum';
import { TipoDocumentoEnum } from '../enums/tipo-documento-enum';

export interface TipoDocumento {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockTipoDocumentoList: TipoDocumento[] = [
  {
    id: 1,
    descripcion: TipoDocumentoEnum.RUC,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: TipoDocumentoEnum.CEDULA,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 3,
    descripcion: TipoDocumentoEnum.PASAPORTE,
    estado: EstadoEnum.ACTIVO,
  },
];
