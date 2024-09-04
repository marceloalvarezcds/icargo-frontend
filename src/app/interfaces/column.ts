import { Params } from '@angular/router';

export interface ColumnLink {
  url: any[] | string;
  queryParams?: Params;
}

export interface Column {
  def: string;
  title: string;
  mainTitle?: string,
  subTitle1?: string,
  customTitle?: string,
  group?: string,
  value?: (row: any) => any;
  footerDef?: () => any;
  buttonCallback?: (row: any) => void;
  buttonIconName?: (row: any) => string;
  isHidden?: (row: any) => boolean;
  isDisable?: (row: any) => boolean;
  link?: (row: any) => ColumnLink | undefined;
  sticky?: boolean;
  stickyEnd?: boolean;
  type?: string;
  isGroupHeader?: boolean; // Añadir esta propiedad
  colspan?: number;
}
