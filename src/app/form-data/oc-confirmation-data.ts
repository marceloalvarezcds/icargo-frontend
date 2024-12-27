import { FormGroup } from '@angular/forms';
import { numberWithCommas } from 'src/app/utils/thousands-separator';
import { FleteList } from 'src/app/interfaces/flete';
import { OCConfirmationInfo } from 'src/app/interfaces/oc-confirmation-dialog-data';
import { CombinacionList } from '../interfaces/combinacion';

export const getOCData = (
  form: FormGroup,
  flete?: FleteList,
  combinacion?: CombinacionList,
 
  neto?: string
): OCConfirmationInfo | null => {
  if (!flete || !neto) return null;
  const value = form.value;
  const info = value.info;
  const propietario_tarifa = `${numberWithCommas(
    flete.condicion_propietario_tarifa
  )} ${flete.condicion_propietario_tarifa_unidad}`;
  return {
    flete_id: flete.id,
    remitente: flete.remitente_nombre,
    producto: flete.producto_descripcion,
    origen: flete.origen_nombre,
    destino: flete.destino_nombre,
    cantidad_nominada: numberWithCommas(info.cantidad_nominada),
    camion: combinacion?.camion_placa ? combinacion.camion_placa : '',
    camion_semi_neto: neto,
    chofer: combinacion?.chofer_nombre ? combinacion.chofer_nombre : '',
    propietario: combinacion?.camion_propietario_nombre ? combinacion.camion_propietario_nombre : '',
    propietario_tarifa,
    propietario_telefono: '',
    semi: combinacion?.semi_placa ? combinacion.semi_placa : '',
    camion_beneficiario_nombre: combinacion?.propietario_nombre ? combinacion.propietario_nombre : '',
  };
};
