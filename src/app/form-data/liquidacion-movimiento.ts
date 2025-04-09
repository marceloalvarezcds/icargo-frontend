import { Movimiento } from 'src/app/interfaces/movimiento';
import { ContraparteGralInfo } from '../interfaces/contraparte-info';
import { Liquidacion } from '../interfaces/liquidacion';
import { Moneda } from '../interfaces/moneda';

export const createLiquidacionData = (movimientos: Movimiento[]): FormData => {
  const formData = new FormData();
  formData.append('data', JSON.stringify({ movimientos: movimientos }));
  return formData;
};

export const removeMovimientoData = (movimiento: Movimiento): FormData => {
  const formData = new FormData();
  formData.append('data', JSON.stringify(movimiento));
  return formData;
};

export const createLiquidacionDataFields = (
    movimientos: Movimiento[], cabecera:ContraparteGralInfo,
    monto:number, es_pago_cobro:string, tipo_mov_liquidacion:string,
    moneda: Moneda, esOrdenPago:boolean = false
  ): FormData => {
  const formData = new FormData();
  formData.append('data', JSON.stringify({
    movimientos,
    cabecera,
    monto:monto,
    es_pago_cobro:
    es_pago_cobro,
    tipo_mov_liquidacion,
    moneda,
    es_orden_pago: esOrdenPago
  }));
  return formData;
};

export const editLiquidacionData = (liquidacion: Liquidacion): FormData => {
  const formData = new FormData();
  formData.append('data', JSON.stringify(liquidacion));
  return formData;
};
