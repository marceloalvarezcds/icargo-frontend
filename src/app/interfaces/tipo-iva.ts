import { EstadoEnum } from 'src/app/enums/estado-enum';
import { mockPaisList } from './pais';

export interface TipoIva {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
  pais_id: number;
  pais_nombre: string;
  pais_nombre_corto: string;
  iva: number;
}

const pais1 = mockPaisList[0];
const pais2 = mockPaisList[1];
const pais3 = mockPaisList[2];

export const mockTipoIvaList: TipoIva[] = [
  {
    id: 1,
    descripcion: `${pais1.nombre_corto}= 10%`,
    estado: EstadoEnum.ACTIVO,
    pais_id: pais1.id,
    pais_nombre: pais1.nombre,
    pais_nombre_corto: pais1.nombre_corto,
    iva: 10,
  },
  {
    id: 2,
    descripcion: `${pais2.nombre_corto}= 21%`,
    estado: EstadoEnum.ACTIVO,
    pais_id: pais2.id,
    pais_nombre: pais2.nombre,
    pais_nombre_corto: pais2.nombre_corto,
    iva: 21,
  },
  {
    id: 3,
    descripcion: `${pais3.nombre_corto}= 19%`,
    estado: EstadoEnum.ACTIVO,
    pais_id: pais3.id,
    pais_nombre: pais3.nombre,
    pais_nombre_corto: pais3.nombre_corto,
    iva: 19,
  },
];

export const mockTipoIva1: TipoIva = mockTipoIvaList[0];
export const mockTipoIva2: TipoIva = mockTipoIvaList[1];
export const mockTipoIva3: TipoIva = mockTipoIvaList[2];
