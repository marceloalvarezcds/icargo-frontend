export interface MonedaCotizacion{
  id: number
  gestor_carga_id: number
  moneda_origen_id: number
  moneda_destino_id: number
  fecha: string
  estado: string
  cotizacion_moneda: number
  gestor_carga_nombre: string
  moneda_origen_nombre: string
  moneda_destino_nombre: string
}
