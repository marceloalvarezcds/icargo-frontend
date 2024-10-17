import { EstadoEnum } from 'src/app/enums/estado-enum';
import { mockLiquidacion1, mockLiquidacion2 } from './liquidacion';
import { mockMoneda1, mockMoneda2 } from './moneda';
import { mockTipoIva1, mockTipoIva2 } from './tipo-iva';

interface FacturaBaseModel {
  moneda_id: number;
  numero_factura: string;
  monto: number;
  iva_id: number;
  fecha_vencimiento: string;
  foto: string | null;
  timbrado: string
  ruc: string
  iva: number
  retencion: number
  fecha_factura: string
  contribuyente: string
}

export interface FacturaForm extends FacturaBaseModel {
  id: number | null;
  liquidacion_id: number | null;
}

export interface Factura extends FacturaBaseModel {
  id: number;
  liquidacion_id: number;
  estado: EstadoEnum;
  contraparte: string;
  contraparte_numero_documento: string;
  iva_descripcion: string;
  moneda_nombre: string;
  moneda_simbolo: string;
  tipo_contraparte_descripcion: string;
  tipo_operacion_descripcion: string;
  // Auditoría
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}

export const mockFacturaForm1: FacturaForm = {
  id: null,
  moneda_id: mockMoneda1.id,
  liquidacion_id: mockLiquidacion1.id,
  numero_factura: '111111-1',
  monto: 100000,
  iva_id: mockTipoIva1.id,
  fecha_vencimiento: '2022-03-16T12:32:14.859823',
  foto: 'foto',
  timbrado: 'string',
  ruc: 'string',
  iva: 0,
  retencion: 0,
  fecha_factura: 'string',
  contribuyente: 'string',
};

export const mockFacturaForm2: FacturaForm = {
  id: null,
  moneda_id: mockMoneda2.id,
  liquidacion_id: mockLiquidacion2.id,
  numero_factura: '222222-1',
  monto: 200000,
  iva_id: mockTipoIva2.id,
  fecha_vencimiento: '2022-03-16T12:32:14.859823',
  foto: null,
  timbrado: 'string',
  ruc: 'string',
  iva: 0,
  retencion: 0,
  fecha_factura: 'string',
  contribuyente: 'string',
};

export const mockFacturaList: Factura[] = [
  {
    ...mockFacturaForm1,
    id: 1,
    estado: EstadoEnum.ACTIVO,
    liquidacion_id: mockLiquidacion1.id,
    // Datos calculados
    contraparte: mockLiquidacion1.contraparte,
    contraparte_numero_documento: mockLiquidacion1.contraparte_numero_documento,
    iva_descripcion: mockTipoIva1.descripcion,
    moneda_nombre: mockMoneda1.nombre,
    moneda_simbolo: mockMoneda1.simbolo,
    tipo_contraparte_descripcion: mockLiquidacion1.tipo_contraparte_descripcion,
    tipo_operacion_descripcion: mockLiquidacion1.tipo_operacion_descripcion,
    // Auditoría
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:34:16.869250',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:34:16.869250',
  },
  {
    ...mockFacturaForm2,
    id: 2,
    estado: EstadoEnum.ACTIVO,
    liquidacion_id: mockLiquidacion2.id,
    // Datos calculados
    contraparte: mockLiquidacion2.contraparte,
    contraparte_numero_documento: mockLiquidacion2.contraparte_numero_documento,
    iva_descripcion: mockTipoIva1.descripcion,
    moneda_nombre: mockMoneda1.nombre,
    moneda_simbolo: mockMoneda1.simbolo,
    tipo_contraparte_descripcion: mockLiquidacion2.tipo_contraparte_descripcion,
    tipo_operacion_descripcion: mockLiquidacion2.tipo_operacion_descripcion,
    // Auditoría
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:34:16.869250',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:34:16.869250',
  },
];
