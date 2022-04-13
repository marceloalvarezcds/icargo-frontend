import { EstadoEnum } from 'src/app/enums/estado-enum';
import { ProductoEnum } from 'src/app/enums/producto-enum';
import { mockTipoCargaList, TipoCarga } from './tipo-carga';

export interface Producto {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
  tipo_carga_id: number;
  tipo_carga: TipoCarga;
  tipo_carga_descripcion: string;
  // Auditoría
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
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
    tipo_carga_descripcion: tipoCarga0.descripcion,
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:32:14.859823',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:32:14.859823',
  },
  {
    id: 2,
    descripcion: ProductoEnum.SOJA,
    estado: EstadoEnum.ACTIVO,
    tipo_carga_id: tipoCarga0.id,
    tipo_carga: tipoCarga0,
    tipo_carga_descripcion: tipoCarga0.descripcion,
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:32:14.859823',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:32:14.859823',
  },
  {
    id: 3,
    descripcion: ProductoEnum.FERTILIZANTE_A_GRANEL,
    estado: EstadoEnum.ACTIVO,
    tipo_carga_id: tipoCarga0.id,
    tipo_carga: tipoCarga0,
    tipo_carga_descripcion: tipoCarga0.descripcion,
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:32:14.859823',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:32:14.859823',
  },
  {
    id: 4,
    descripcion: ProductoEnum.ACEITE_DE_SOJA,
    estado: EstadoEnum.ACTIVO,
    tipo_carga_id: tipoCarga1.id,
    tipo_carga: tipoCarga1,
    tipo_carga_descripcion: tipoCarga1.descripcion,
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:32:14.859823',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:32:14.859823',
  },
  {
    id: 5,
    descripcion: ProductoEnum.GANADO,
    estado: EstadoEnum.ACTIVO,
    tipo_carga_id: tipoCarga0.id,
    tipo_carga: tipoCarga0,
    tipo_carga_descripcion: tipoCarga0.descripcion,
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:32:14.859823',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:32:14.859823',
  },
];
