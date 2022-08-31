import { of } from 'rxjs';
import { EstadoEnum } from '../enums/estado-enum';
import { Column } from './column';
import { FleteList, mockFleteList } from './flete';
import { FleteAnticipo, mockFleteAnticipoList } from './flete-anticipo';

export interface FleteAnticipoDialogData {
  list: FleteAnticipo[];
  data?: FleteAnticipo;
}

export interface SelectorDialogData<T> {
  columns: Column[];
  list: T[];
  title: string;
  selectedValue?: T | null;
  fetchFunction: any;
  isFetchPaginator: boolean;
}

export const mockFleteAnticipoDialogData: FleteAnticipoDialogData = {
  list: mockFleteAnticipoList,
  data: mockFleteAnticipoList[0],
}

export const mockFleteAnticipoDialogData2: FleteAnticipoDialogData = {
  list: mockFleteAnticipoList,
}

export const mockSelectorDialogData: SelectorDialogData<FleteList> = {
  columns: [
    { def: 'id', title: 'Nº', value: (element: FleteList) => element.id, sticky: true },
    { def: 'producto_descripcion', title: 'Producto', value: (element: FleteList) => element.producto_descripcion },
  ],
  list: mockFleteList,
  title: 'Flete',
  selectedValue: mockFleteList[0],
  fetchFunction: () => of(),
  isFetchPaginator: false,
};

export const mockSelectorDialogData2: SelectorDialogData<FleteList> = {
  columns: [
    { def: 'id', title: 'Nº', value: (element: FleteList) => element.id, sticky: true },
    { def: 'producto_descripcion', title: 'Producto', value: (element: FleteList) => element.producto_descripcion },
  ],
  list: mockFleteList.filter(x => x.estado !== EstadoEnum.FINALIZADO),
  title: 'Flete',
  fetchFunction: () => of(),
  isFetchPaginator: true,
};
