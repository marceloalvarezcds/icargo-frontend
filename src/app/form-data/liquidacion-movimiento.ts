import { Movimiento } from 'src/app/interfaces/movimiento';
import { Liquidacion } from '../interfaces/liquidacion';

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

export const createLiquidacionDataMonto = (movimientos: Movimiento[], monto:number, es_pago_cobro:string): FormData => {
  const formData = new FormData();
  formData.append('data', JSON.stringify({ movimientos: movimientos, monto:monto, es_pago_cobro: es_pago_cobro}));
  return formData;
};

export const editLiquidacionData = (liquidacion: Liquidacion): FormData => {
  const formData = new FormData();
  formData.append('data', JSON.stringify(liquidacion));
  return formData;
};
