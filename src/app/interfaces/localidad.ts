import { Pais } from "./pais";

export interface Localidad {
  id: number;
  nombre: string;
  pais_id: number;
  pais: Pais
}
