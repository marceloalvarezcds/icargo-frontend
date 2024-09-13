import { Movimiento } from 'src/app/interfaces/movimiento';

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

export const createLiquidacionDataMonto = (movimientos: Movimiento[], monto:number): FormData => {
  const formData = new FormData();
  formData.append('data', JSON.stringify({ movimientos: movimientos, monto:monto }));
  return formData;
};
