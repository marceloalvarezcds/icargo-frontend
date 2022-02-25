export interface Column {
  def: string;
  title: string;
  value?: (row: any) => any;
  buttonCallback?: (row: any) => void;
  sticky?: boolean;
  stickyEnd?: boolean;
  footerDef?: string;
  type?: string;
}
