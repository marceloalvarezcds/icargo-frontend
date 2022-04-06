import { Params } from '@angular/router';

export interface ColumnLink {
  url: any[] | string;
  queryParams?: Params;
}

export interface Column {
  def: string;
  title: string;
  value?: (row: any) => any;
  buttonCallback?: (row: any) => void;
  buttonIconName?: (row: any) => string;
  isHidden?: (row: any) => boolean;
  isDisable?: (row: any) => boolean;
  link?: (row: any) => ColumnLink | undefined;
  sticky?: boolean;
  stickyEnd?: boolean;
  footerDef?: string;
  type?: string;
}
