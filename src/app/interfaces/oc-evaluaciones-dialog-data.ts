import { OrdenCargaEvaluacionesHistorial } from "./orden_carga_evaluacion";

export interface EvaluacionDialogData {
  item?: OrdenCargaEvaluacionesHistorial; // Cambiar el tipo según el modelo de evaluación que estés usando
  orden_carga_id: number;       // ID de la orden de carga asociada
}

  