export interface Column {
  def: string;
  title: string;
  value?: (row: any) => any;
  sticky?: boolean;
  stickyEnd?: boolean;
  footerDef?: string;
  type?: string;
}
