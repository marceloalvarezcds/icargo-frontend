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


export const mockOrdenCargaComentariosHistorialList: OrdenCargaComentariosHistorial[] = [
  {
    id: 1,
    orden_carga_id: 1,
    comentario: 'si',
    // Auditoría
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
  },
  {
    id: 2,
    orden_carga_id: 1,
    comentario: 'si',
    // Auditoría
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
  },
  {
    id: 3,
    orden_carga_id: 1,
    comentario: 'si',
    // Auditoría
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
  },
];
