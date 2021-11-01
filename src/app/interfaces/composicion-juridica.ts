import { EstadoEnum } from '../enums/estado-enum';

export interface ComposicionJuridica {
  id: number;
  nombre: string;
  nombre_corto: string;
  estado: EstadoEnum;
}

export const mockComposicionJuridicaList: ComposicionJuridica[] = [
  {
    id: 1,
    nombre: 'Uni-personal',
    nombre_corto: 'U.P.',
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    nombre: 'Sociedad Anónima',
    nombre_corto: 'S.A.',
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 3,
    nombre: 'Sociedad de Responsabilidad Limitada',
    nombre_corto: 'S.R.L.',
    estado: EstadoEnum.ACTIVO,
  },
];
