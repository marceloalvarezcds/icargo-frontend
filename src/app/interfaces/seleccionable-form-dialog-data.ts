import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import {
  mockSeleccionableBaseModel1,
  SeleccionableBaseModel,
} from './seleccionable';

export interface SeleccionableRouteData {
  modelo: m;
  submodule: string;
  changeStatusMsg: string;
}

export interface SeleccionableFormDialogData {
  item?: SeleccionableBaseModel;
  modelo: m;
  submodule: string;
}

export const mockSeleccionableFormDialogData: SeleccionableFormDialogData = {
  item: mockSeleccionableBaseModel1,
  modelo: m.CARGO,
  submodule: 'Cargo',
};

export const mockSeleccionableFormDialogDataWithoutItem: SeleccionableFormDialogData =
  {
    modelo: m.CARGO,
    submodule: 'Cargo',
  };
