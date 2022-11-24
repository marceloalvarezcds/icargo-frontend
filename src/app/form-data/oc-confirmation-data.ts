import { FormGroup } from '@angular/forms';
import { numberWithCommas } from 'src/app/utils/thousands-separator';
import { FleteList } from 'src/app/interfaces/flete';
import { OCConfirmationInfo } from 'src/app/interfaces/oc-confirmation-dialog-data';
import { CamionList } from 'src/app/interfaces/camion';
import { SemiList } from 'src/app/interfaces/semi';

export const getOCData = (
  form: FormGroup,
  flete?: FleteList,
  camion?: CamionList,
  semi?: SemiList,
  neto?: string
): OCConfirmationInfo | null => {
  if (!flete || !camion || !semi || !neto) return null;
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
    camion: camion.placa,
    camion_semi_neto: neto,
    chofer: camion.chofer_nombre,
    propietario: camion.propietario_nombre,
    propietario_tarifa,
    propietario_telefono: camion.propietario_telefono,
    semi: semi.placa,
  };
};
