export interface CheckboxModel {
  [key: string]: boolean;
}

export interface CheckboxFilterEvent {
  filteredList: string[];
  isResetPressed: boolean;
}

export interface SearchOptions {
  textToSearch: string;
  isFilteredByGlobalSearch: boolean;
}

export const defaultSearchOptions: SearchOptions = {
  textToSearch: '',
  isFilteredByGlobalSearch: true,
}
