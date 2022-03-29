import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  Contraparte,
  ContraparteEtapa,
  ContraparteInfo,
} from 'src/app/interfaces/contraparte-info';

export function getQueryParams(
  contraparte: Contraparte,
  etapa?: LiquidacionEtapaEnum
): Contraparte | ContraparteEtapa {
  if (etapa) {
    return {
      tipo_contraparte_id: contraparte.tipo_contraparte_id,
      contraparte: contraparte.contraparte,
      contraparte_numero_documento: contraparte.contraparte_numero_documento,
      etapa,
    };
  }
  return {
    tipo_contraparte_id: contraparte.tipo_contraparte_id,
    contraparte: contraparte.contraparte,
    contraparte_numero_documento: contraparte.contraparte_numero_documento,
  };
}

export function getParamsBy(
  tipo_contraparte_id: number,
  contraparte: string,
  contraparte_numero_documento: string
): string {
  return getParams({
    tipo_contraparte_id,
    tipo_contraparte_descripcion: '',
    contraparte,
    contraparte_numero_documento,
  });
}

export function getParams(
  contraparteInfo: ContraparteInfo,
  etapa?: LiquidacionEtapaEnum
): string {
  const contraparte = encodeURIComponent(contraparteInfo.contraparte);
  const numeroDocumento = encodeURIComponent(
    contraparteInfo.contraparte_numero_documento
  );
  if (etapa) {
    const status = encodeURIComponent(etapa);
    return `tipo_contraparte/${contraparteInfo.tipo_contraparte_id}/contraparte/${contraparte}/numero_documento/${numeroDocumento}/etapa/${status}`;
  }
  return `tipo_contraparte/${contraparteInfo.tipo_contraparte_id}/contraparte/${contraparte}/numero_documento/${numeroDocumento}`;
}
