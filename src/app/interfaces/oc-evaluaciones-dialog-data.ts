import { OrdenCargaEvaluacionesHistorial } from "./orden_carga_evaluacion";
import { TipoIncidente } from "./tipo_evaluacion";

export interface EvaluacionDialogData {
  id?: number | null;
  tipo_incidente_id: number;
  tipo_incidente: TipoIncidente;
  comentarios: string;
  nota: string;
  concepto: string;
  orden_carga_id?: number;
  camion_id: number; 
  semi_id: number;
  propietario_id: number;
  chofer_id: number;
  gestor_carga_id: number;
  origen_id: number;
  destino_id: number;
  producto_id: number;
}

  