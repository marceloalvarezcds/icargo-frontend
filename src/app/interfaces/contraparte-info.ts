export interface ContraparteBaseModel {
  contraparte: string;
  contraparte_numero_documento: string;
  tipo_contraparte_id: number;
}

export interface Contraparte extends ContraparteBaseModel {
  contraparte_id: number;
}

export interface ContraparteWithId extends ContraparteBaseModel {
  id: number;
  info: string;
  tipo_contraparte_descripcion: string;
}

export interface ContraparteEtapa extends Contraparte {
  etapa: string;
}

export interface ContraparteInfo extends ContraparteBaseModel {
  tipo_contraparte_descripcion: string;
}

export interface ContraparteInfoMovimiento extends Contraparte {
  tipo_contraparte_descripcion: string;
}

export const mockContraparteInfoList: ContraparteInfoMovimiento[] = [
  {
    contraparte_id: 1,
    contraparte: 'ADM SANTA RITA',
    contraparte_numero_documento: '3100100',
    tipo_contraparte_id: 3,
    tipo_contraparte_descripcion: 'Remitente',
  },
  {
    contraparte_id: 2,
    contraparte: 'GICAL KM12',
    contraparte_numero_documento: 'p-100100',
    tipo_contraparte_id: 4,
    tipo_contraparte_descripcion: 'Proveedor',
  },
  {
    contraparte_id: 3,
    contraparte: 'LA PAZ',
    contraparte_numero_documento: '800100100',
    tipo_contraparte_id: 4,
    tipo_contraparte_descripcion: 'Proveedor',
  },
  {
    contraparte_id: 4,
    contraparte: 'PUERTO UNION',
    contraparte_numero_documento: 'p-400400',
    tipo_contraparte_id: 1,
    tipo_contraparte_descripcion: 'Propietario',
  },
];
