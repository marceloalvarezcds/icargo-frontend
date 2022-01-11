import { EstadoEnum } from 'src/app/enums/estado-enum';
import { ProductoEnum } from 'src/app/enums/producto-enum';
import { mockTipoCargaList, TipoCarga } from './tipo-carga';

export interface Producto {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
  tipo_carga_id: number;
  tipo_carga: TipoCarga;
}

const tipoCarga0 = mockTipoCargaList[0];
const tipoCarga1 = mockTipoCargaList[1];

export const mockProductoList: Producto[] = [
  {
    id: 1,
    descripcion: ProductoEnum.TRIGO,
    estado: EstadoEnum.ACTIVO,
    tipo_carga_id: tipoCarga0.id,
    tipo_carga: tipoCarga0,
  },
  {
    id: 2,
    descripcion: ProductoEnum.SOJA,
    estado: EstadoEnum.ACTIVO,
    tipo_carga_id: tipoCarga0.id,
    tipo_carga: tipoCarga0,
  },
  {
    id: 3,
    descripcion: ProductoEnum.FERTILIZANTE_A_GRANEL,
    estado: EstadoEnum.ACTIVO,
    tipo_carga_id: tipoCarga0.id,
    tipo_carga: tipoCarga0,
  },
  {
    id: 4,
    descripcion: ProductoEnum.ACEITE_DE_SOJA,
    estado: EstadoEnum.ACTIVO,
    tipo_carga_id: tipoCarga1.id,
    tipo_carga: tipoCarga1,
  },
  {
    id: 5,
    descripcion: ProductoEnum.GANADO,
    estado: EstadoEnum.ACTIVO,
    tipo_carga_id: tipoCarga0.id,
    tipo_carga: tipoCarga0,
  },
];
