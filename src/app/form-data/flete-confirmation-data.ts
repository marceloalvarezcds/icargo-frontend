import { FormGroup } from '@angular/forms';
import { TipoAnticipoEnum } from 'src/app/enums/tipo-anticipo-enum';
import { FleteConfirmationInfo } from 'src/app/interfaces/flete-confirmation-dialog-data';
import { FleteDestinatario } from 'src/app/interfaces/flete-destinatario';
import { numberWithCommas } from 'src/app/utils/thousands-separator';

export const getFleteData = (form: FormGroup): FleteConfirmationInfo => {
  const value = form.value;
  const info = value.info;
  const tramo = value.tramo;
  const condicion = value.condicion;
  const merma = value.merma;
  const emision = value.emision_orden;
  const anticipos: Record<string, string> = value.anticipos?.reduce(
    (obj: Record<string, string>, anticipo: any) => {
      if (!anticipo.porcentaje) return obj;
      const key =
        anticipo.tipo_descripcion === TipoAnticipoEnum.EFECTIVO
          ? anticipo.tipo_descripcion
          : anticipo.tipo_insumo_descripcion;
      obj[key] = `${anticipo.porcentaje} %`;
      return obj;
    },
    {}
  );
  const complementos: Record<string, string> = value.complementos?.reduce(
    (obj: Record<string, string>, complemento: any) => {
      const propietario = `\nPropietario: ${numberWithCommas(complemento.propietario_monto)} ${complemento.propietario_moneda_simbolo} (${numberWithCommas(complemento.propietario_monto_ml)} ${condicion.moneda_gestora_nombre})`;

      const remitente = complemento.habilitar_cobro_remitente
        ? `\nRemitente: ${numberWithCommas(complemento.remitente_monto)} ${complemento.remitente_moneda_simbolo} (${numberWithCommas(complemento.remitente_monto_ml)} ${condicion.moneda_gestora_nombre})`
        : '';

      const anticipado = '\nAnticipado: ' + (complemento.anticipado ? 'Si' : 'No');

      obj[complemento.concepto_descripcion] = `${propietario}${remitente}${anticipado}`;
      return obj;
    },
    {}
  );

  const descuentos: Record<string, string> = value.descuentos?.reduce(
    (obj: Record<string, string>, descuento: any) => {
      const propietario = `\nPropietario: ${numberWithCommas(descuento.propietario_monto)} ${descuento.propietario_moneda_simbolo} (${numberWithCommas(descuento.propietario_monto_ml)} ${condicion.moneda_gestora_nombre})`;

      const proveedor = descuento.habilitar_pago_proveedor
        ? `\nProveedor: ${numberWithCommas(descuento.proveedor_monto)} ${descuento.proveedor_moneda_simbolo} (${numberWithCommas(descuento.proveedor_monto_ml)} ${condicion.moneda_gestora_nombre})`
        : '';

      obj[descuento.concepto_descripcion] = `${propietario}${proveedor}`;
      return obj;
    },
    {}
  );

  const gestor_carga_tarifa = `${numberWithCommas(
    condicion.condicion_gestor_carga_tarifa
  )} ${condicion.condicion_gestor_carga_moneda_simbolo}/${
    condicion.condicion_gestor_carga_unidad_abreviatura
  }`;
    const gestor_carga_tarifa_ml = `${numberWithCommas(
    condicion.condicion_gestor_carga_tarifa_ml
  )} ${condicion.moneda_gestora_nombre}/${
    'KG'
  }`;
  const gestor_carga_merma = `${numberWithCommas(
    merma.merma_gestor_carga_valor
  )} ${merma.merma_gestor_carga_moneda_simbolo}/${
    merma.merma_gestor_carga_unidad_abreviatura
  }`;
  const gestor_carga_merma_ml = `${numberWithCommas(
    merma.merma_gestor_carga_valor_ml
  )} ${condicion.moneda_gestora_nombre}/${
    'KG'
  }`;
  const gestor_carga_tolerancia =
    numberWithCommas(merma.merma_gestor_carga_tolerancia) +
    (merma.merma_gestor_carga_es_porcentual
      ? ' %'
      : ` ${merma.merma_gestor_carga_moneda_simbolo}/${merma.merma_gestor_carga_unidad_abreviatura}`);
  const propietario_tarifa = `${numberWithCommas(
    condicion.condicion_propietario_tarifa
  )} ${condicion.condicion_propietario_moneda_simbolo}/${
    condicion.condicion_propietario_unidad_abreviatura
  }`;
  const propietario_tarifa_ml = `${numberWithCommas(
    condicion.condicion_propietario_tarifa_ml
  )} ${condicion.moneda_gestora_nombre}/${
    'KG'
  }`;
  const propietario_merma = `${numberWithCommas(
    merma.merma_propietario_valor
  )} ${merma.merma_propietario_moneda_simbolo}/${
    merma.merma_propietario_unidad_abreviatura
  }`;
  const propietario_merma_ml = `${numberWithCommas(
    merma.merma_propietario_valor_ml
  )} ${condicion.moneda_gestora_nombre}/${
    'KG'
  }`;
  const propietario_tolerancia =
    numberWithCommas(merma.merma_propietario_tolerancia) +
    (merma.merma_propietario_es_porcentual
      ? ' %'
      : ` ${merma.merma_propietario_moneda_simbolo}/${merma.merma_propietario_unidad_abreviatura}`);
  const destinatarios =
    emision.destinatarios
      ?.map((dest: FleteDestinatario) => {
        const tipoDestinatario =
          dest.tipo_destinatario === 'centro_operativo'
            ? dest.tipo_centro_operativo
            : dest.tipo_destinatario;
        return `${dest.nombre} [${tipoDestinatario}] (${dest.email})`;
      })
      .join(', ') ?? '';
  return {
    id: value.id,
    remitente: info.remitente_nombre,
    producto: info.producto_descripcion,
    numero_lote: value.info.numero_lote,
    origen: tramo.origen_nombre,
    destino: tramo.destino_nombre,
    cantidad: numberWithCommas(condicion.condicion_cantidad),
    gestor_carga_tarifa,
    gestor_carga_tarifa_ml,
    gestor_carga_merma,
    gestor_carga_merma_ml,
    gestor_carga_tolerancia,
    propietario_tarifa,
    propietario_tarifa_ml,
    propietario_merma,
    propietario_merma_ml,
    propietario_tolerancia,
    anticipos,
    complementos,
    descuentos,
    emision_orden_destinatarios: destinatarios,
    emision_orden_texto_legal: emision.emision_orden_texto_legal,
    emision_orden_detalle: emision.emision_orden_detalle,
  };
};
