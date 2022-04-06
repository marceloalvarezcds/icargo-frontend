import { EstadoEnum } from 'src/app/enums/estado-enum';
import { Instrumento } from './instrumento';

export interface CajaForm {
  nombre: string;
  moneda_id: number;
  gestor_carga_id: number | null;
}

export interface Caja extends CajaForm {
  id: number;
  gestor_carga_id: number;
  estado: EstadoEnum;
  instrumentos: Instrumento[];
  // Campos calculados
  moneda_nombre: string;
  moneda_simbolo: string;
  credito: number;
  debito: number;
  saldo_confirmado: number;
  // Auditoría
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}

export const mockCajaList: Caja[] = [
  {
    nombre: 'Caja en Boliviano',
    moneda_id: 5,
    gestor_carga_id: 1,
    id: 6,
    estado: EstadoEnum.ACTIVO,
    instrumentos: [],
    moneda_nombre: 'Peso Boliviano',
    moneda_simbolo: 'BOP',
    credito: 0,
    debito: 0,
    saldo_confirmado: 0,
    created_by: 'System',
    created_at: '2022-03-03T19:38:55.907002',
    modified_by: 'System',
    modified_at: '2022-03-03T19:38:55.907002',
  },
  {
    nombre: 'Caja en Dolares',
    moneda_id: 2,
    gestor_carga_id: 1,
    id: 3,
    estado: EstadoEnum.ACTIVO,
    instrumentos: [],
    moneda_nombre: 'Dolares',
    moneda_simbolo: 'USD',
    credito: 0,
    debito: 0,
    saldo_confirmado: 0,
    created_by: 'System',
    created_at: '2022-03-03T19:38:55.875838',
    modified_by: 'System',
    modified_at: '2022-03-03T19:38:55.875838',
  },
  {
    nombre: 'Caja en Guaranies',
    moneda_id: 1,
    gestor_carga_id: 1,
    id: 2,
    estado: EstadoEnum.ACTIVO,
    instrumentos: [],
    moneda_nombre: 'Guaranies',
    moneda_simbolo: 'PYG',
    credito: 0,
    debito: 0,
    saldo_confirmado: 0,
    created_by: 'System',
    created_at: '2022-03-03T19:38:55.863454',
    modified_by: 'System',
    modified_at: '2022-03-03T19:38:55.863454',
  },
  {
    nombre: 'Caja en Peso Arg',
    moneda_id: 4,
    gestor_carga_id: 1,
    id: 5,
    estado: EstadoEnum.ACTIVO,
    instrumentos: [],
    moneda_nombre: 'Peso Argentino',
    moneda_simbolo: 'ARP',
    credito: 0,
    debito: 0,
    saldo_confirmado: 0,
    created_by: 'System',
    created_at: '2022-03-03T19:38:55.896555',
    modified_by: 'System',
    modified_at: '2022-03-03T19:38:55.896555',
  },
  {
    nombre: 'Caja en Reales',
    moneda_id: 3,
    gestor_carga_id: 1,
    id: 4,
    estado: EstadoEnum.ACTIVO,
    instrumentos: [],
    moneda_nombre: 'Real',
    moneda_simbolo: 'BRL',
    credito: 0,
    debito: 0,
    saldo_confirmado: 0,
    created_by: 'System',
    created_at: '2022-03-03T19:38:55.886242',
    modified_by: 'System',
    modified_at: '2022-03-03T19:38:55.886242',
  },
  {
    nombre: 'CajaX',
    moneda_id: 1,
    gestor_carga_id: 1,
    id: 1,
    estado: EstadoEnum.ELIMINADO,
    instrumentos: [],
    moneda_nombre: 'Guaranies',
    moneda_simbolo: 'PYG',
    credito: 0,
    debito: 0,
    saldo_confirmado: 0,
    created_by: 'System',
    created_at: '2022-03-03T19:38:55.847541',
    modified_by: 'System',
    modified_at: '2022-03-03T19:38:55.847541',
  },
];

export const mockCaja1: Caja = mockCajaList[0];
export const mockCaja2: Caja = mockCajaList[1];
