import { EstadoEnum } from 'src/app/enums/estado-enum';
import { OrdenCargaEstadoEnum } from 'src/app/enums/orden-carga-enum';

export interface OrdenCargaComentariosHistorial {
    id: number;
    orden_carga_id: number;
    comentario?: string; // El comentario es opcional
    // Auditoría
    created_by: string;
    created_at: string;
    modified_by: string;
    modified_at: string;
  }
  