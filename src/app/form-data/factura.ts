import { FormGroup } from '@angular/forms';

export const facturaData = (
  form: FormGroup,
  fotoFile: File | null,
  liquidacion_id: number,
  tipo_contraparte_id: number,
  contraparte_id: number,
): FormData => {
  const value = form.value;
  delete value.foto;

  const sentido_mov_iva = value.sentido_mov_iva_pagar ? 'PAGAR' : value.sentido_mov_iva_cobrar ? 'COBRAR' : undefined;
  const sentido_mov_retencion = value.sentido_mov_retencion_pagar ? 'PAGAR' : value.sentido_mov_retencion_cobrar ? 'COBRAR' : undefined;;

  const data = JSON.parse(
    JSON.stringify({
      ...form.value,
      sentido_mov_iva,
      sentido_mov_retencion,
      liquidacion_id,
      tipo_contraparte_id,
      contraparte_id,
    })
  );
  const formData = new FormData();
  formData.append('data', JSON.stringify(data));
  if (fotoFile) {
    formData.append('foto_file', fotoFile);
  }
  return formData;
};
