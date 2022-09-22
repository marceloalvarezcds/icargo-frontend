export interface UserPuntoVenta {
  id: number;
  username: string;
  is_admin: boolean;
  is_admin_descripcion: string;
}

export interface UserPuntoVentaEditForm {
  confirm_password: string;
  admin_password: string;
}

export interface UserPuntoVentaCreateForm {
  username: string;
  password: string;
  confirm_password: string;
}

export interface UserPuntoVentaCreateFormDialogData {
  punto_venta_id: number;
  is_admin: boolean;
}

export const mockAdminUserPuntoVentaCreateFormDialogData: UserPuntoVentaCreateFormDialogData =
  {
    punto_venta_id: 1,
    is_admin: true,
  };

export const mockUserPuntoVentaCreateFormDialogData: UserPuntoVentaCreateFormDialogData =
  {
    punto_venta_id: 1,
    is_admin: false,
  };

export interface UserPuntoVentaEditFormDialogData {
  is_admin: boolean;
  user_id: number;
  username: string;
}

export const mockAdminUserPuntoVentaEditFormDialogData: UserPuntoVentaEditFormDialogData =
  {
    is_admin: true,
    user_id: 1,
    username: 'username1',
  };

export const mockUserPuntoVentaEditFormDialogData: UserPuntoVentaEditFormDialogData =
  {
    is_admin: false,
    user_id: 1,
    username: 'username1',
  };
