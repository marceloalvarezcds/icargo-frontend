import { FormGroup } from '@angular/forms';

export const facturaData = (
  form: FormGroup,
  fotoFile: File | null,
  liquidacion_id: number
): FormData => {
  const value = form.value;
  delete value.foto;
  const data = JSON.parse(
    JSON.stringify({
      ...form.value,
      liquidacion_id,
    })
  );
  const formData = new FormData();
  formData.append('data', JSON.stringify(data));
  if (fotoFile) {
    formData.append('foto_file', fotoFile);
  }
  return formData;
};
