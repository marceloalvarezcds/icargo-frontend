import { EstadoEnum } from 'src/app/enums/estado-enum';
import { ProductoEnum } from 'src/app/enums/producto-enum';

export interface Producto {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockProductoList: Producto[] = [
  {
    id: 1,
    descripcion: ProductoEnum.TRIGO,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: ProductoEnum.SOJA,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 3,
    descripcion: ProductoEnum.FERTILIZANTE_A_GRANEL,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 4,
    descripcion: ProductoEnum.ACEITE_DE_SOJA,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 5,
    descripcion: ProductoEnum.GANADO,
    estado: EstadoEnum.ACTIVO,
  },
];
