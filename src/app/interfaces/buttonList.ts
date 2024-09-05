
export interface ButtonList {
  color?: string;
  tooltip?: string;
  clases?: string;
  styles?: string;
  icon?: string;
  iconClass?: string;
  label?: string;
  buttonCallback: (row: any) => void;
}
