export interface FleteConfirmationInfo {
  id: number;
  remitente: string;
  producto: string;
  numero_lote: string;
  origen: string;
  destino: string;
  cantidad: string;
  gestor_carga_tarifa: string;
  gestor_carga_merma: string;
  gestor_carga_tolerancia: string;
  propietario_tarifa: string;
  propietario_merma: string;
  propietario_tolerancia: string;
  anticipos: Record<string, string>;
  complementos: Record<string, string>;
  descuentos: Record<string, string>;
  emision_orden_destinatarios: string;
  emision_orden_texto_legal: string;
  emision_orden_detalle: string;
}

export interface FleteConfirmationDialogData {
  flete: FleteConfirmationInfo;
}

export const mockFleteConfirmationInfo: FleteConfirmationInfo = {
  id: 0,
  remitente: 'GICAL KM12',
  producto: 'Aceite de Soja',
  numero_lote: '4564654',
  origen: 'ITAKYRY',
  gestor_carga_tarifa: '150 PYG/kg',
  gestor_carga_merma: '800 PYG/kg',
  gestor_carga_tolerancia: '1.000 PYG/kg',
  propietario_tarifa: '100 PYG/kg',
  propietario_merma: '1.000 PYG/kg',
  propietario_tolerancia: '10 %',
  destino: 'LA PAZ',
  cantidad: '10.000',
  anticipos: { EFECTIVO: '30 %', COMBUSTIBLE: '15 %', LUBRICANTES: '5 %' },
  complementos: {
    Expurgo: 'Propietario: 100.000 PYG | Anticipado: No',
    Peaje: 'Propietario: 50.000 PYG | Remitente: 50.000 PYG | Anticipado: Si',
  },
  descuentos: {
    Seguro: 'Propietario: 250.000 PYG',
    Sistema: 'Propietario: 100.000 PYG | Proveedor: 100.000 PYG',
  },
  emision_orden_destinatarios:
    'Maria Cardozo [Origen] (maria@cardozo.com), Pedro Molinas [Remitente] (pedro@molinas.com)',
  emision_orden_detalle: 'Detalle del Texto Legal',
  emision_orden_texto_legal: 'Texto Legal',
};

export const mockFleteConfirmationDialogData: FleteConfirmationDialogData = {
  flete: mockFleteConfirmationInfo,
};
