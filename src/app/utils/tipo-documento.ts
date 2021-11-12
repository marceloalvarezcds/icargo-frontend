import { TipoDocumentoEnum } from "../enums/tipo-documento-enum";
import { mockTipoDocumentoList, TipoDocumento } from "../interfaces/tipo-documento";

export const isRuc = (tipoDocumentList: TipoDocumento[], tipoDocumentoId?: number): boolean => {
  const tipoDocumento = tipoDocumentList.find(x => x.id === tipoDocumentoId);
  return tipoDocumento?.descripcion === TipoDocumentoEnum.RUC;
};

isRuc(mockTipoDocumentoList, 1);
