import { EstadoEnum } from 'src/app/enums/estado-enum';
import { SeleccionableBaseModel } from './seleccionable';

export interface TipoIncidente {
  id: number;
  descripcion: string;
  estado: EstadoEnum;
}

