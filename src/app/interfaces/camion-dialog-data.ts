import { Camion, CamionList } from "./camion";

export interface CamionDialogData {
  item?: CamionList; // El camión específico si se está editando
  propietario_id: number | undefined; // ID del propietario
  camion_id?: number; // ID del camión, si es necesario
}
