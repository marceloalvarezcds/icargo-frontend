export interface CheckboxModel {
  [key: string]: boolean;
}

export interface CheckboxFilterEvent {
  filteredList: string[];
  isResetPressed: boolean;
}
