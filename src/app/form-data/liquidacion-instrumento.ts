import { InstrumentoForm } from 'src/app/interfaces/instrumento';

export const addInstrumentosData = (
  instrumentos: InstrumentoForm[]
): FormData => {
  const formData = new FormData();
  formData.append('data', JSON.stringify({ instrumentos }));
  return formData;
};
