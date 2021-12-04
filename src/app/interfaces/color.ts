import { ColorEnum } from 'src/app/enums/color-enum';
import { EstadoEnum } from 'src/app/enums/estado-enum';

export interface Color {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockColorList: Color[] = [
  {
    id: 1,
    descripcion: ColorEnum.AZUL,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: ColorEnum.BLANCO,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 3,
    descripcion: ColorEnum.GRIS,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 4,
    descripcion: ColorEnum.NEGRO,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 5,
    descripcion: ColorEnum.ROJO,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 6,
    descripcion: ColorEnum.VERDE,
    estado: EstadoEnum.ACTIVO,
  },
];
