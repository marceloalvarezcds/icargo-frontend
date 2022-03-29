export const changeLiquidacionStatusData = (comentario: string): FormData => {
  const formData = new FormData();
  formData.append('data', JSON.stringify(comentario));
  return formData;
};
