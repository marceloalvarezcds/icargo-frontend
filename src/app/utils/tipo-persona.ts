import { TipoPersonaEnum } from "../enums/tipo-persona-enum";
import { mockTipoPersonaList, TipoPersona } from "../interfaces/tipo-persona";

export const isFisica = (tipoPersonaList: TipoPersona[], tipoPersonaId?: number): boolean => {
  const tipoPersona = tipoPersonaList.find(x => x.id === tipoPersonaId);
  return tipoPersona?.descripcion === TipoPersonaEnum.FISICA;
};

isFisica(mockTipoPersonaList, 1);
