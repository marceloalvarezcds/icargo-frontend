export interface OrdenCargaRemisionResultado {
  responsable: string;
  tarifa_flete: number;
  total_flete: number;
  merma_valor: number;
  tolerancia: number;
  tolerancia_kg: number;
  complemento_descuento: number;
  merma: number;
  merma_valor_total: number;
  merma_valor_total_moneda_local: number;
  total_complemento: number | null;
  total_descuento: number | null;
  total_anticipo: number | null;
  saldo: number;
  total_efectivo: number;
  total_combustible: number;
  saldo_bruto: number;
}

export const mockOrdenCargaRemisionResultadoList: OrdenCargaRemisionResultado[] =
  [];
