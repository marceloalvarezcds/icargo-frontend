import { EstadoEnum } from '../enums/estado-enum';

export interface Moneda {
  id: number;
  nombre: string;
  simbolo: string;
  estado: EstadoEnum;
}

export const mockMonedaList: Moneda[] = [
  {
    id: 1,
    nombre: 'Guaranies',
    simbolo: 'PYG',
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    nombre: 'Dolares',
    simbolo: 'USD',
    estado: EstadoEnum.ACTIVO,
  },
];
