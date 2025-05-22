export interface OrdenCargaEvaluacionesHistorial {
    id: number;
    orden_carga_id: number;
    comentario?: string | null;
    tipo_incidente_id?: number | null;
    gestor_carga_id?: number | null;
    camion_id?: number | null;
    semi_id?: number | null;
    propietario_id?: number | null;
    chofer_id?: number | null;
    concepto?: string | null;
    nota?: string | null;
    origen_id?: number | null;
    destino_id?: number | null;
    producto_id?: number | null;

    oc_camion_placa: string | null;
    oc_semi_placa: string | null;
    oc_chofer_nombre: string | null;
    oc_beneficiario_nombre: string | null;
    oc_origen_nombre: string | null;
    oc_destino_nombre: string | null;
    promedio_tracto_gestor: number | null
    promedio_tracto_general: number | null
    promedio_semi_gestor: number | null
    promedio_semi_general: number | null
    promedio_chofer_gestor: number | null
    promedio_chofer_general: number | null
    promedio_propietario_gestor: number | null
    promedio_propietario_general: number | null
    // Campos adicionales
    created_by: string;
    created_at: Date;
    modified_by: string;
    modified_at: Date;
    comentarios?: string | null;
  }

  export const mockOrdenCargaEvaluacionesHistorialList: OrdenCargaEvaluacionesHistorial[] = [
    {
      id: 1,
      orden_carga_id: 1,
      comentario: 'Evaluación positiva del servicio',
      tipo_incidente_id: null,
      gestor_carga_id: 101,
      camion_id: 201,
      semi_id: null,
      propietario_id: null,
      chofer_id: 301,
      concepto: 'Servicio de carga',
      nota: 'Todo en orden',
      origen_id: 401,
      destino_id: 501,
      producto_id: 601,
      created_by: 'admin',
      oc_camion_placa: '9022',
      oc_semi_placa: '133440',
      oc_chofer_nombre: 'some',
      oc_beneficiario_nombre: 'some',
      oc_origen_nombre: 'some',
      oc_destino_nombre: 'some',
      promedio_tracto_gestor: 10,
      promedio_tracto_general: 12,
      promedio_semi_gestor: 5,
      promedio_semi_general: 3,
      promedio_chofer_gestor: 2,
      promedio_chofer_general: 1,
      promedio_propietario_gestor: 4,
      promedio_propietario_general: 5,
      created_at: new Date('2021-11-30T20:38:09.553757'),
      modified_by: 'admin',
      modified_at: new Date('2021-11-30T20:38:09.553757'),
      comentarios: null,
    },
    {
      id: 2,
      orden_carga_id: 1,
      comentario: 'Requiere seguimiento adicional',
      tipo_incidente_id: 2,
      gestor_carga_id: 102,
      camion_id: 202,
      semi_id: null,
      propietario_id: 402,
      chofer_id: 302,
      concepto: 'Cuidado con el contenido',
      nota: 'Necesita revisión',
      origen_id: 402,
      destino_id: 502,
      producto_id: 602,
      oc_camion_placa: '9022',
      oc_semi_placa: '133440',
      oc_chofer_nombre: 'some',
      oc_beneficiario_nombre: 'some',
      oc_origen_nombre: 'some',
      oc_destino_nombre: 'some',
      promedio_tracto_gestor: 10,
      promedio_tracto_general: 12,
      promedio_semi_gestor: 5,
      promedio_semi_general: 3,
      promedio_chofer_gestor: 2,
      promedio_chofer_general: 1,
      promedio_propietario_gestor: 4,
      promedio_propietario_general: 5,
      created_by: 'admin',
      created_at: new Date('2021-12-01T12:38:09.553757'),
      modified_by: 'admin',
      modified_at: new Date('2021-12-01T12:38:09.553757'),
      comentarios: 'Sugerir mejoras en el proceso',
    },
    {
      id: 3,
      orden_carga_id: 2,
      comentario: 'Todo correcto',
      tipo_incidente_id: null,
      gestor_carga_id: 101,
      camion_id: 203,
      semi_id: 303,
      propietario_id: 403,
      chofer_id: 303,
      concepto: 'Carga completa',
      nota: 'Sin observaciones',
      origen_id: 403,
      destino_id: 503,
      producto_id: 603,
      oc_camion_placa: '9022',
      oc_semi_placa: '133440',
      oc_chofer_nombre: 'some',
      oc_beneficiario_nombre: 'some',
      oc_origen_nombre: 'some',
      oc_destino_nombre: 'some',
      promedio_tracto_gestor: 10,
      promedio_tracto_general: 12,
      promedio_semi_gestor: 5,
      promedio_semi_general: 3,
      promedio_chofer_gestor: 2,
      promedio_chofer_general: 1,
      promedio_propietario_gestor: 4,
      promedio_propietario_general: 5,
      created_by: 'admin',
      created_at: new Date('2021-12-02T10:38:09.553757'),
      modified_by: 'admin',
      modified_at: new Date('2021-12-02T10:38:09.553757'),
      comentarios: null,
    },
  ];
