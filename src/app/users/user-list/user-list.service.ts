import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { User } from 'src/app/interfaces/user';
import { DialogService } from 'src/app/services/dialog.service';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserListService {
  private cols: Column[] = [
    {
      def: 'id',
      title: 'Nº',
      value: (element: User) => element.id,
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
      def: 'roles',
      title: 'Roles',
      value: (element: User) =>
        element.roles.map((r) => r.descripcion).join(', '),
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: User) => element.estado.toUpperCase(),
    },
    {
      def: 'created_by',
      title: 'Usuario creación',
      value: (element: User) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha creación',
      value: (element: User) => this.formatDate(element.created_at),
    },
    {
      def: 'modified_by',
      title: 'Usuario modificación',
      value: (element: User) => element.modified_by,
    },
    {
      def: 'modified_at',
      title: 'Fecha modificación',
      value: (element: User) => this.formatDate(element.modified_at),
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];
  private lista: User[] = [];

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  }


  get columns(): Column[] {
    return this.cols;
  }

  get list(): User[] {
    return this.lista;
  }

  constructor(
    private router: Router,
    private service: UserService,
    private dialog: DialogService
  ) {}

  getList(): void {
    this.service.getListByGestorCargaId().subscribe((list) => {
      this.lista = list;
    });
  }

  // redirectToCreate(): void {
  //   this.router.navigate([`/users/${m.USER}/${a.CREAR}`]);
  // }

  // redirectToEdit(rol: User): void {
  //   this.router.navigate([`/users/${m.USER}/${a.EDITAR}`, rol.id]);
  // }

  // redirectToShow(rol: User): void {
  //   this.router.navigate([`/users/${m.USER}/${a.VER}`, rol.id]);
  // }

  redirectToCreate(): void {
    const url = `/users/${m.USER}/${a.CREAR}`;
    window.open(url, '_blank');
  }
  
  redirectToEdit(rol: User): void {
    const url = `/users/${m.USER}/${a.EDITAR}/${rol.id}`;
    window.open(url, '_blank');
  }
  
  redirectToShow(rol: User): void {
    const url = `/users/${m.USER}/${a.VER}/${rol.id}`;
    window.open(url, '_blank');
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

  private fullName(user: User): string {
    return `${user.first_name} ${user.last_name}`;
  }

  private changeStatusMessage(user: User, accion: string): string {
    return `¿Está seguro que desea ${accion} al usuario ${this.fullName(
      user
    )}?`;
  }
}
