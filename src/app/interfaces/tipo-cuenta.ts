import { EstadoEnum } from 'src/app/enums/estado-enum';

export interface TipoCuenta {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockTipoCuentaList: TipoCuenta[] = [
  {
    id: 1,
    descripcion: 'Viajes',
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: 'Otros',
    estado: EstadoEnum.ACTIVO,
  },
];
