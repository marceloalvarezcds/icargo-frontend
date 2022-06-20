import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserFormDialogComponent } from 'src/app/dialogs/user-form-dialog/user-form-dialog.component';
import { Column } from 'src/app/interfaces/column';
import { User } from 'src/app/interfaces/user';
import { UserFormDialogData } from 'src/app/interfaces/user-form-dialog-data';
import { DialogService } from 'src/app/services/dialog.service';
import { UserService } from 'src/app/services/user.service';
import { create, edit } from 'src/app/utils/table-event-crud';

@Injectable({
  providedIn: 'root',
})
export class UserListService {
  private cols: Column[] = [
    {
      def: 'id',
      title: 'Nº',
      value: (element: User) => element.id,
      sticky: true,
    },
    {
      def: 'first_name',
      title: 'Nombre',
      value: (element: User) => element.first_name,
    },
    {
      def: 'last_name',
      title: 'Apellido',
      value: (element: User) => element.last_name,
    },
    {
      def: 'username',
      title: 'Usuario',
      value: (element: User) => element.username,
    },
    {
      def: 'email',
      title: 'Correo Electrónico',
      value: (element: User) => element.email,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: User) => element.estado,
    },
    {
      def: 'created_by',
      title: 'Usuario creación',
      value: (element: User) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha creación',
      value: (element: User) => element.created_at,
      type: 'date',
    },
    {
      def: 'modified_by',
      title: 'Usuario modificación',
      value: (element: User) => element.modified_by,
    },
    {
      def: 'modified_at',
      title: 'Fecha modificación',
      value: (element: User) => element.modified_at,
      type: 'date',
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];
  private lista: User[] = [];

  get columns(): Column[] {
    return this.cols;
  }

  get list(): User[] {
    return this.lista;
  }

  constructor(private service: UserService, private dialog: DialogService) {}

  getList(): void {
    this.service.getListByGestorCargaId().subscribe((list) => {
      this.lista = list;
    });
  }

  create(): void {
    create(this.getDialogRef(), () => {
      this.getList();
    });
  }

  edit(user: User): void {
    edit(this.getDialogRef(user), () => {
      this.getList();
    });
  }

  active(user: User): void {
    this.dialog.changeStatusConfirm(
      this.changeStatusMessage(user, 'activar'),
      this.service.active(user.id),
      () => {
        this.getList();
      }
    );
  }

  inactive(user: User): void {
    this.dialog.changeStatusConfirm(
      this.changeStatusMessage(user, 'desactivar'),
      this.service.inactive(user.id),
      () => {
        this.getList();
      }
    );
  }

  private getDialogRef(
    item?: User
  ): MatDialogRef<UserFormDialogComponent, UserFormDialogData> {
    const data: UserFormDialogData = { item };
    return this.dialog.open(UserFormDialogComponent, { data });
  }

  private fullName(user: User): string {
    return `${user.first_name} ${user.last_name}`;
  }

  private changeStatusMessage(user: User, accion: string): string {
    return `¿Está seguro que desea ${accion} al usuario ${this.fullName(
      user
    )}?`;
  }
}
