import { TipoPersonaEnum } from "../enums/tipo-persona-enum";
import { ComposicionJuridica } from "../interfaces/composicion-juridica";
import { mockTipoPersonaList, TipoPersona } from "../interfaces/tipo-persona";

export const isFisica = (composicionJuridicaList: ComposicionJuridica[], compJuridicaId?: number): boolean => {
    if (!compJuridicaId) {
      return false;
    }
    const tipoPersona = composicionJuridicaList.find(x => x.id === compJuridicaId);
    return tipoPersona?.nombre === 'Persona Física';
  };
  