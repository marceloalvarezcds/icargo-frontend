import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserPuntoVentaCreateFormDialogComponent } from 'src/app/dialogs/user-punto-venta-create-form-dialog/user-punto-venta-create-form-dialog.component';
import { UserPuntoVentaEditFormDialogComponent } from 'src/app/dialogs/user-punto-venta-edit-form-dialog/user-punto-venta-edit-form-dialog.component';
import {
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { PuntoVenta } from 'src/app/interfaces/punto-venta';
import { TableEvent } from 'src/app/interfaces/table';
import {
  UserPuntoVenta,
  UserPuntoVentaCreateFormDialogData,
  UserPuntoVentaEditFormDialogData,
} from 'src/app/interfaces/user-punto-venta';
import { UserService } from 'src/app/services/user.service';
import { create, remove } from 'src/app/utils/table-event-crud';

@Component({
  selector: 'app-punto-venta-form-users',
  templateUrl: './punto-venta-form-users.component.html',
  styleUrls: ['./punto-venta-form-users.component.scss'],
})
export class PuntoVentaFormUsersComponent {
  a = PermisoAccionEnum;
  columns: Column[] = [
    {
      def: 'id',
      title: 'Nº',
      value: (element: UserPuntoVenta) => element.id,
      sticky: true,
    },
    {
      def: 'username',
      title: 'Usuario',
      value: (element: UserPuntoVenta) => element.username,
    },
    {
      def: 'is_admin',
      title: 'Es administrador',
      value: (element: UserPuntoVenta) => element.is_admin_descripcion,
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];
  modelo = m.USER;
  adminUserId?: number;
  userId?: number;

  @Input() gestorCargaId?: number;
  @Input() isShow = false;
  @Input() puntoVentaId?: number;
  @Input() list: UserPuntoVenta[] = [];

  @Output() usersCreated = new EventEmitter<void>();

  constructor(private dialog: MatDialog, private userService: UserService) {}

  create(isAdmin: boolean = false): void {
    create(this.getCreateDialogRef(isAdmin), this.emitChange.bind(this));
  }

  edit({ row }: TableEvent<UserPuntoVenta>): void {
    create(this.getEditDialogRef(row), this.emitChange.bind(this));
  }

  remove({ row }: TableEvent<UserPuntoVenta>): void {
    remove(
      this.dialog,
      `¿Está seguro que desea eliminar al usuario ${row.username}?`,
      () => {
        this.userService.delete(row.id).subscribe(this.emitChange.bind(this));
      }
    );
  }

  private getCreateDialogRef(
    isAdmin: boolean
  ): MatDialogRef<UserPuntoVentaCreateFormDialogComponent, PuntoVenta> {
    const data: UserPuntoVentaCreateFormDialogData = {
      punto_venta_id: this.puntoVentaId!,
      is_admin: isAdmin,
    };
    return this.dialog.open(UserPuntoVentaCreateFormDialogComponent, { data });
  }

  private getEditDialogRef(
    user: UserPuntoVenta
  ): MatDialogRef<UserPuntoVentaEditFormDialogComponent, PuntoVenta> {
    const data: UserPuntoVentaEditFormDialogData = {
      is_admin: user.is_admin,
      user_id: user.id,
      username: user.username,
    };
    return this.dialog.open(UserPuntoVentaEditFormDialogComponent, { data });
  }

  private emitChange(): void {
    this.usersCreated.emit();
  }
}
