import { EstadoEnum } from 'src/app/enums/estado-enum';

export interface TipoDocumentoRelacionado {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockTipoDocumentoRelacionadoList: TipoDocumentoRelacionado[] = [
  {
    id: 1,
    descripcion: 'OC',
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: 'Otro',
    estado: EstadoEnum.ACTIVO,
  },
];
