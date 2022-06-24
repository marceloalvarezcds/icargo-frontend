import { mockRol, Rol } from './rol';

export interface RolFormDialogData {
  item?: Rol;
}

export const mockRolFormDialogData: RolFormDialogData = {
  item: mockRol,
};

export const mockRolFormDialogDataWithoutItem: RolFormDialogData = {};
