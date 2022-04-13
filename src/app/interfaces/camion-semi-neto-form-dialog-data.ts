import { CamionSemiNeto, mockCamionSemiNetoList } from './camion-semi-neto';

export interface CamionSemiNetoFormDialogData {
  item?: CamionSemiNeto;
  camion_id: number;
  camion_info: string;
}

export const mockCamionSemiNetoFormDialogData: CamionSemiNetoFormDialogData = {
  item: mockCamionSemiNetoList[0],
  camion_id: 1,
  camion_info: '1',
};

export const mockCamionSemiNetoFormDialogDataWithoutItem: CamionSemiNetoFormDialogData =
  {
    camion_id: 1,
    camion_info: '1',
  };
