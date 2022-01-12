import { EstadoEnum } from 'src/app/enums/estado-enum';
import { UnidadEnum } from 'src/app/enums/unidad-enum';

export interface Unidad {
  id: number;
  descripcion: string;
  abreviatura: string;
  estado: EstadoEnum;
  conversion_kg: number,
}

export const mockUnidadList: Unidad[] = [
  {
    id: 1,
    descripcion: UnidadEnum.KILOGRAMOS,
    abreviatura: UnidadEnum.KILOGRAMOS,
    estado: EstadoEnum.ACTIVO,
    conversion_kg: 1,
  },
  {
    id: 2,
    descripcion: UnidadEnum.TONELADAS,
    abreviatura: UnidadEnum.TONELADAS,
    estado: EstadoEnum.ACTIVO,
    conversion_kg: 0.001,
  },
  {
    id: 3,
    descripcion: UnidadEnum.LITROS,
    abreviatura: UnidadEnum.LITROS,
    estado: EstadoEnum.ACTIVO,
    conversion_kg: 1,
  },
];
