export interface CheckboxModel {
  [key: string]: boolean;
}

export interface CheckboxFilterEvent {
  filteredList: string[];
  isResetPressed: boolean;
}

export interface SearchOptions {
  url: string;
  textToSearch: string;
  isFilteredByGlobalSearch: boolean;
}

export const defaultSearchOptions: SearchOptions = {
  url: '',
  textToSearch: '',
  isFilteredByGlobalSearch: true,
};
