import { EstadoEnum } from 'src/app/enums/estado-enum';

export interface TipoMovimiento {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockTipoMovimientoList: TipoMovimiento[] = [
  {
    id: 1,
    descripcion: 'Anticipo',
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: 'Complemento',
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 3,
    descripcion: 'Descuento',
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 4,
    descripcion: 'Merma',
    estado: EstadoEnum.ACTIVO,
  },
];
