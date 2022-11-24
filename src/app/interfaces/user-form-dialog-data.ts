import { mockUser, User } from './user';

export interface UserFormDialogData {
  item?: User;
}

export const mockUserFormDialogData: UserFormDialogData = {
  item: mockUser,
};

export const mockUserFormDialogDataWithoutItem: UserFormDialogData = {};
