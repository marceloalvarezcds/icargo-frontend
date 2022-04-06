import { EstadoEnum } from 'src/app/enums/estado-enum';

export interface TipoInstrumento {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockTipoInstrumentoList: TipoInstrumento[] = [
  {
    id: 1,
    descripcion: 'Efectivo',
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: 'Cheque',
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 3,
    descripcion: 'Transferencia',
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 4,
    descripcion: 'Tarjeta de Débito',
    estado: EstadoEnum.ACTIVO,
  },
];

export const mockTipoInstrumento1: TipoInstrumento = mockTipoInstrumentoList[0];
export const mockTipoInstrumento2: TipoInstrumento = mockTipoInstrumentoList[1];
