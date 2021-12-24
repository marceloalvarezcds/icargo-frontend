import { FleteAnticipo, mockFleteAnticipoList } from './flete-anticipo';

export interface FleteAnticipoDialogData {
  list: FleteAnticipo[];
  data?: FleteAnticipo;
}

export const mockFleteAnticipoDialogData: FleteAnticipoDialogData = {
  list: mockFleteAnticipoList,
  data: mockFleteAnticipoList[0],
}

export const mockFleteAnticipoDialogData2: FleteAnticipoDialogData = {
  list: mockFleteAnticipoList,
}
