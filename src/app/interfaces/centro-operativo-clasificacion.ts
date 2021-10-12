import { EstadoEnum } from "../enums/estado-enum";

export interface CentroOperativoClasificacion {
  id: number;
  nombre: string;
  estado: EstadoEnum;
}
