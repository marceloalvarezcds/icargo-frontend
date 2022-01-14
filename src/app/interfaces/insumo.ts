import { EstadoEnum } from 'src/app/enums/estado-enum';
import { mockTipoAnticipoList } from './tipo-anticipo';
import { mockUnidadList } from './unidad';

export interface InsumoForm {
  descripcion: string;
  tipo_id: number;
  unidad_id?: number | null;
  estado: EstadoEnum;
}

export interface Insumo extends InsumoForm {
  id: number;
  tipo_descripcion: string;
  unidad_descripcion?: string | null;
  unidad_abreviatura?: string | null;
}

const tipo0 = mockTipoAnticipoList[0];
const tipo1 = mockTipoAnticipoList[1];
const tipo2 = mockTipoAnticipoList[1];

const unidad0 = mockUnidadList[0];
const unidad1 = mockUnidadList[1];

export const mockInsumoList: Insumo[] = [
  {
    id: 1,
    descripcion: 'GASOIL COMÚN',
    tipo_id: tipo1.id,
    tipo_descripcion: tipo1.descripcion,
    unidad_id: unidad0.id,
    unidad_descripcion: unidad0.descripcion,
    unidad_abreviatura: unidad0.abreviatura,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: 'ACEITE DE MOTOR COMÚN',
    tipo_id: tipo2.id,
    tipo_descripcion: tipo2.descripcion,
    unidad_id: unidad1.id,
    unidad_descripcion: unidad1.descripcion,
    unidad_abreviatura: unidad1.abreviatura,
    estado: EstadoEnum.ACTIVO,
  },
];
