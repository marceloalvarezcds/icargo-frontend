import { EstadoEnum } from 'src/app/enums/estado-enum';

export interface TipoEvaluacion {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}