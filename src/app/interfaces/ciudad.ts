import { Localidad } from "./localidad";

export interface Ciudad {
  id: Number;
  nombre: string;
  localidad_id: Number;
  localidad: Localidad;
}
