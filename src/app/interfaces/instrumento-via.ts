import { EstadoEnum } from 'src/app/enums/estado-enum';
import { InstrumentoViaEnum } from 'src/app/enums/instrumento-via';

export interface InstrumentoVia {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockInstrumentoViaList: InstrumentoVia[] = [
  {
    id: 1,
    descripcion: InstrumentoViaEnum.CAJA,
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    descripcion: InstrumentoViaEnum.BANCO,
    estado: EstadoEnum.ACTIVO,
  },
];

export const mockInstrumentoVia1: InstrumentoVia = mockInstrumentoViaList[0];
export const mockInstrumentoVia2: InstrumentoVia = mockInstrumentoViaList[1];
