import { EstadoEnum } from 'src/app/enums/estado-enum';
import { TipoConceptoDescuentoEnum } from 'src/app/enums/tipo-concepto-descuento-enum';

export interface TipoConceptoDescuento {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockTipoConceptoDescuentoList: TipoConceptoDescuento[] = [
  {
    id: 1,
    descripcion: TipoConceptoDescuentoEnum.SEGURO,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: TipoConceptoDescuentoEnum.SISTEMA,
    estado: EstadoEnum.ACTIVO,
  },
];
