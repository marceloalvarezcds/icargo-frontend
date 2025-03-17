
import { SeleccionableBaseModel } from './seleccionable';

export interface TextoLegal extends SeleccionableBaseModel {
  id: number;
  titulo: string;
  texto_legal?: string;
}
