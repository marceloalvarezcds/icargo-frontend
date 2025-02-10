import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import { TipoContraparteEnum } from 'src/app/enums/tipo-contraparte-enum';
import {
  Contraparte,
  ContraparteEtapa,
  ContraparteGralInfo,
  ContraparteInfo,
} from 'src/app/interfaces/contraparte-info';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { Movimiento } from 'src/app/interfaces/movimiento';

export function getQueryParams(
  contraparte: ContraparteGralInfo,
  etapa?: LiquidacionEtapaEnum
): Contraparte | ContraparteEtapa | ContraparteGralInfo {
  if (etapa) {
    return {
      tipo_contraparte_id: contraparte.tipo_contraparte_id,
      contraparte_id: contraparte.tipo_contraparte_descripcion === "Otro" ? contraparte.tipo_contraparte_id : contraparte.contraparte_id,
      contraparte: contraparte.contraparte,
      contraparte_numero_documento: contraparte.contraparte_numero_documento,
      etapa,
    };
  }
  return {
    tipo_contraparte_id: contraparte.tipo_contraparte_id,
    contraparte_id: contraparte.tipo_contraparte_descripcion === "Otro" ? contraparte.tipo_contraparte_id : contraparte.contraparte_id,
    contraparte: contraparte.contraparte,
    contraparte_numero_documento: contraparte.contraparte_numero_documento,
    punto_venta_id: (contraparte.punto_venta_id! > 0) ? contraparte.punto_venta_id : undefined,
    flujo: contraparte.tipo_flujo,
    es_pdv: contraparte.es_pdv
  };
}

export function getQueryParamsPDV(
  contraparte: ContraparteGralInfo,
  etapa?: LiquidacionEtapaEnum
): Contraparte | ContraparteEtapa | ContraparteGralInfo {
  if (etapa) {
    return {
      tipo_contraparte_id: contraparte.tipo_contraparte_id,
      contraparte_id: contraparte.contraparte_id,
      contraparte: contraparte.contraparte,
      contraparte_numero_documento: contraparte.contraparte_numero_documento,
      etapa,
      punto_venta_id: contraparte.punto_venta_id,
      flujo: contraparte.tipo_flujo,
      es_pdv: contraparte.es_pdv
    };
  }
  return {
    tipo_contraparte_id: contraparte.tipo_contraparte_id,
    contraparte_id: contraparte.tipo_contraparte_descripcion === "Otro" ? contraparte.tipo_contraparte_id : contraparte.contraparte_id,
    contraparte: contraparte.contraparte_pdv!,
    contraparte_numero_documento: contraparte.contraparte_numero_documento_pdv!,
    punto_venta_id: (contraparte.punto_venta_id! > 0) ? contraparte.punto_venta_id : undefined,
    flujo: contraparte.tipo_flujo,
    es_pdv: contraparte.es_pdv
  };
}

export function getParamsBy(
  tipo_contraparte_id: number,
  contraparte_id: number,
  contraparte: string,
  contraparte_numero_documento: string,
  punto_venta_id?: number
): string {
  return getParams(
    {
      tipo_contraparte_id,
      tipo_contraparte_descripcion: '',
      contraparte,
      contraparte_numero_documento,
    },
    contraparte_id,
    undefined,
    punto_venta_id
  );
}

export function getParamsByPDV(
  contraparte_id: number,
  contraparte: string,
  contraparte_numero_documento: string,
  punto_venta_id: number,
  flujo: string,
): string {

  const contraparteNombre = encodeURIComponent(contraparte);
  const numeroDocumento = encodeURIComponent(contraparte_numero_documento);

  let endpoint = `flujo/${flujo}/id/${contraparte_id}/contraparte/${contraparteNombre}/numero_documento/${numeroDocumento}/punto_venta/${punto_venta_id}`;

  return endpoint;
}

export function getContraparteId(obj: Movimiento | Liquidacion): number {
  if (obj.tipo_contraparte_descripcion === TipoContraparteEnum.PROPIETARIO) {
    return obj.propietario_id!;
  } else if (
    obj.tipo_contraparte_descripcion === TipoContraparteEnum.REMITENTE
  ) {
    return obj.remitente_id!;
  } else if (
    obj.tipo_contraparte_descripcion === TipoContraparteEnum.PROVEEDOR
  ) {
    return obj.proveedor_id!;
  } else if (obj.tipo_contraparte_descripcion === TipoContraparteEnum.CHOFER) {
    return obj.chofer_id!;
  } else {
    return obj.tipo_contraparte_id;
  }
}

export function getParams(
  contraparteInfo: ContraparteInfo,
  contraparte_id: number,
  etapa?: LiquidacionEtapaEnum,
  pdv?: number,
  listar_efectivo_insumo?: string,
): string {

  const contraparte = encodeURIComponent(contraparteInfo.contraparte);
  const numeroDocumento = encodeURIComponent(contraparteInfo.contraparte_numero_documento);

  let endpoint = `tipo_contraparte/${contraparteInfo.tipo_contraparte_id}/id/${contraparte_id}/contraparte/${contraparte}/numero_documento/${numeroDocumento}`;

  if (etapa) {
    const status = encodeURIComponent(etapa);
    endpoint = `${endpoint}/etapa/${status}`;
  }

  if (pdv) {

    if (listar_efectivo_insumo) endpoint = `${endpoint}/punto_venta_id/${pdv}/tipo_movimiento/${listar_efectivo_insumo}`;
    else endpoint = `${endpoint}/punto_venta_id/${pdv}`;

  }

  return endpoint;
}
