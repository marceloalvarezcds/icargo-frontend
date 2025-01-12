import { Observable, of } from 'rxjs';
import { EstadoEnum } from '../enums/estado-enum';
import { Column } from './column';
import { FleteList, mockFleteList } from './flete';
import { FleteAnticipo, mockFleteAnticipoList } from './flete-anticipo';
import { PaginatedList, PaginatedListRequest } from './paginate-list';

export interface FleteAnticipoDialogData {
  list: FleteAnticipo[];
  data?: FleteAnticipo;
}

interface SelectorDialogDataBase<T> {
  list: T[];
  title: string;
  subtitle?: string;
  selectedValue?: T | null;
}

export class Marker<T> extends google.maps.Marker {
  info: T | null = null;
  template: string = '';
  isActive = false;
  isSelected = false;
}

export interface SelectorInMapDialogData<T> extends SelectorDialogDataBase<T> {
  drawMarkerFunction?: (item: T) => Marker<T>;
  filterFunction?: (regexList: RegExp[], item: T | null) => boolean;
}

export interface SelectorDialogData<T> extends SelectorDialogDataBase<T> {
  columns: Column[];
  fetchFunction?: (request: PaginatedListRequest) => Observable<PaginatedList<T>>;
  fetchFunctionLocal?: () => Observable<T[]>;
}

export const mockFleteAnticipoDialogData: FleteAnticipoDialogData = {
  list: mockFleteAnticipoList,
  data: mockFleteAnticipoList[0],
};

export const mockFleteAnticipoDialogData2: FleteAnticipoDialogData = {
  list: mockFleteAnticipoList,
};

export const mockSelectorInMapDialogData: SelectorInMapDialogData<FleteList> = {
  list: mockFleteList,
  title: 'Flete',
  selectedValue: mockFleteList[0],
};

export const mockSelectorInMapDialogData2: SelectorInMapDialogData<FleteList> =
  {
    list: mockFleteList,
    title: 'Flete',
  };

export const mockSelectorDialogData: SelectorDialogData<FleteList> = {
  columns: [
    {
      def: 'id',
      title: 'Nº',
      value: (element: FleteList) => element.id,
      sticky: true,
    },
    {
      def: 'producto_descripcion',
      title: 'Producto',
      value: (element: FleteList) => element.producto_descripcion,
    },
  ],
  list: mockFleteList,
  title: 'Flete',
  selectedValue: mockFleteList[0],
};

export const mockSelectorDialogData2: SelectorDialogData<FleteList> = {
  columns: [
    {
      def: 'id',
      title: 'Nº',
      value: (element: FleteList) => element.id,
      sticky: true,
    },
    {
      def: 'producto_descripcion',
      title: 'Producto',
      value: (element: FleteList) => element.producto_descripcion,
    },
  ],
  list: mockFleteList.filter((x) => x.estado !== EstadoEnum.FINALIZADO),
  title: 'Flete',
  fetchFunction: () => of(),
};
