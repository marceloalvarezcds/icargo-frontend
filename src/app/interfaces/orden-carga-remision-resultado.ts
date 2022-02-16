export interface OrdenCargaRemisionResultado {
  responsable: string;
  tarifa_flete: number;
  total_flete: number;
  merma_valor: number;
  tolerancia: number;
  tolerancia_kg: number;
  merma: number;
  merma_valor_total: number;
  merma_valor_total_moneda_local: number;
  total_complemento: number | null;
  total_descuento: number | null;
  total_anticipo: number | null;
  saldo: number;
}

export const mockOrdenCargaRemisionResultadoList: OrdenCargaRemisionResultado[] =
  [];
