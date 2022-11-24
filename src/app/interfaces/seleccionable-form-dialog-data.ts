import { ComponentType } from '@angular/cdk/portal';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { Column } from './column';
import {
  mockSeleccionableBaseModel1,
  SeleccionableBaseModel,
} from './seleccionable';

export interface SeleccionableRouteData<DialogComponent, DialogData> {
  modelo: m;
  submodule: string;
  changeStatusMsg: string;
  dialogComponent: ComponentType<DialogComponent>;
  getDialogData?: (item?: SeleccionableBaseModel) => DialogData;
  additionalColumns?: Column[];
}

export interface SeleccionableFormDialogData<
  T extends SeleccionableBaseModel = SeleccionableBaseModel
> {
  item?: T;
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
