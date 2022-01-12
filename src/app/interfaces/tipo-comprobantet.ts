import { EstadoEnum } from 'src/app/enums/estado-enum';
import { TipoComprobanteEnum } from 'src/app/enums/tipo-comprobante-enum';

export interface TipoComprobante {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockTipoComprobanteList: TipoComprobante[] = [
  {
    id: 1,
    descripcion: TipoComprobanteEnum.FACTURA,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: TipoComprobanteEnum.RECIBO,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 3,
    descripcion: TipoComprobanteEnum.TICKET,
    estado: EstadoEnum.ACTIVO,
  },
];
